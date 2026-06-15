import * as p from "@clack/prompts";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { execa } from "execa";
import { repoPnpm } from "../lib/pnpm.js";
import {
  CUSTOM_SOURCE_COMMIT,
  CUSTOM_SOURCE_REPOSITORY_URL,
} from "../lib/source.js";
import { getCustomLocalRepoDir } from "../lib/custom-names.js";

interface GitResult {
  stdout: string;
}

type GitRunner = (args: string[], cwd: string) => Promise<GitResult>;

async function runGit(args: string[], cwd: string): Promise<GitResult> {
  return execa("git", args, { cwd });
}

function normalizeGitUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

export function isExpectedSourceRepositoryUrl(url: string): boolean {
  return (
    normalizeGitUrl(url) === normalizeGitUrl(CUSTOM_SOURCE_REPOSITORY_URL)
  );
}

async function requireGitRepo(repoDir: string, git: GitRunner): Promise<void> {
  let result: GitResult;
  try {
    result = await git(["rev-parse", "--is-inside-work-tree"], repoDir);
  } catch {
    throw new Error(
      `${repoDir} はGit repositoryではありません。利用者の既存ディレクトリは変更せず、セットアップを停止しました。`,
    );
  }
  if (result.stdout.trim() !== "true") {
    throw new Error(
      `${repoDir} はGit repositoryではありません。利用者の既存ディレクトリは変更せず、セットアップを停止しました。`,
    );
  }
}

async function requireExpectedOrigin(
  repoDir: string,
  git: GitRunner,
): Promise<void> {
  let origin: GitResult;
  try {
    origin = await git(["remote", "get-url", "origin"], repoDir);
  } catch {
    throw new Error(
      `取得済みリポジトリにoriginがありません。期待する取得元: ${CUSTOM_SOURCE_REPOSITORY_URL}`,
    );
  }

  const actual = origin.stdout.trim();
  if (!isExpectedSourceRepositoryUrl(actual)) {
    throw new Error(
      [
        "取得済みリポジトリのoriginが改造版リポジトリと一致しません。",
        `期待: ${CUSTOM_SOURCE_REPOSITORY_URL}`,
        `実際: ${actual || "(空)"}`,
        "公式repoや別forkを上書きしないため、セットアップを停止しました。",
      ].join("\n"),
    );
  }
}

async function requireCleanWorktree(
  repoDir: string,
  git: GitRunner,
): Promise<void> {
  const status = await git(["status", "--porcelain"], repoDir);
  if (status.stdout.trim() !== "") {
    throw new Error(
      [
        "取得済みリポジトリに未コミットの変更があります。",
        "利用者の変更をreset/clean/deleteしないため、セットアップを停止しました。",
        "変更を保存または別ディレクトリへ退避してから再実行してください。",
      ].join("\n"),
    );
  }
}

export async function validateExistingSourceRepo(
  repoDir: string,
  git: GitRunner = runGit,
): Promise<void> {
  await requireGitRepo(repoDir, git);
  await requireExpectedOrigin(repoDir, git);
  await requireCleanWorktree(repoDir, git);
}

export async function checkoutPinnedSourceCommit(
  repoDir: string,
  git: GitRunner = runGit,
): Promise<void> {
  await git(["fetch", "origin", CUSTOM_SOURCE_COMMIT], repoDir);
  await git(["checkout", "--detach", CUSTOM_SOURCE_COMMIT], repoDir);

  const head = await git(["rev-parse", "HEAD"], repoDir);
  const actual = head.stdout.trim();
  if (actual !== CUSTOM_SOURCE_COMMIT) {
    throw new Error(
      [
        "固定commitのcheckout検証に失敗しました。",
        `期待: ${CUSTOM_SOURCE_COMMIT}`,
        `実際: ${actual || "(空)"}`,
      ].join("\n"),
    );
  }
}

async function preparePinnedSourceRepo(repoDir: string): Promise<void> {
  await validateExistingSourceRepo(repoDir);
  await checkoutPinnedSourceCommit(repoDir);
  await requireCleanWorktree(repoDir, runGit);
}

async function prepareFreshPinnedSourceRepo(repoDir: string): Promise<void> {
  await requireGitRepo(repoDir, runGit);
  await requireExpectedOrigin(repoDir, runGit);
  await checkoutPinnedSourceCommit(repoDir);
  await requireCleanWorktree(repoDir, runGit);
}

/**
 * Clone the LINE Harness repo and install dependencies.
 * Returns the path to the cloned repo.
 */
export async function ensureRepo(repoDir: string | null): Promise<string> {
  // If --repo-dir was given and has the repo, use it.
  if (repoDir && existsSync(join(repoDir, "pnpm-workspace.yaml"))) {
    await preparePinnedSourceRepo(repoDir);
    return repoDir;
  }

  // Check if cwd is the repo.
  if (existsSync(join(process.cwd(), "pnpm-workspace.yaml"))) {
    await preparePinnedSourceRepo(process.cwd());
    return process.cwd();
  }

  // Check standard install location.
  const homeDir = getCustomLocalRepoDir();
  if (existsSync(join(homeDir, "pnpm-workspace.yaml"))) {
    const s = p.spinner();
    s.start("固定済みの改造版ソースを確認中...");
    await preparePinnedSourceRepo(homeDir);
    s.stop("固定済みソースの確認完了");
    return homeDir;
  }

  // Clone fresh.
  const s = p.spinner();
  s.start("LINE Harness をダウンロード中...");

  try {
    await execa("git", [
      "clone",
      "--no-checkout",
      CUSTOM_SOURCE_REPOSITORY_URL,
      homeDir,
    ]);
  } catch (error: any) {
    s.stop("ダウンロード失敗");
    throw new Error(
      `git clone に失敗しました: ${error.message}\ngit がインストールされているか確認してください。`,
    );
  }
  try {
    await prepareFreshPinnedSourceRepo(homeDir);
  } catch (error: any) {
    s.stop("固定commitの取得失敗");
    throw new Error(
      `改造版ソースの固定commit取得に失敗しました: ${error.message}`,
    );
  }
  s.stop("ダウンロード完了");

  // Install dependencies.
  s.start("依存関係インストール中...");
  try {
    await repoPnpm(homeDir, ["install", "--frozen-lockfile"], {
      cwd: homeDir,
    });
  } catch {
    // Try without frozen lockfile.
    await repoPnpm(homeDir, ["install"], { cwd: homeDir });
  }
  s.stop("依存関係インストール完了");

  return homeDir;
}
