import { describe, expect, it } from "vitest";
import {
  checkoutPinnedSourceCommit,
  isExpectedSourceRepositoryUrl,
  validateExistingSourceRepo,
} from "../src/steps/clone-repo";
import {
  CUSTOM_SOURCE_COMMIT,
  CUSTOM_SOURCE_REPOSITORY_URL,
} from "../src/lib/source";

type GitCall = string[];

function createGitRunner(
  handler: (args: string[]) => string | Error,
): {
  calls: GitCall[];
  git: (args: string[], cwd: string) => Promise<{ stdout: string }>;
} {
  const calls: GitCall[] = [];
  return {
    calls,
    git: async (args: string[]) => {
      calls.push(args);
      const result = handler(args);
      if (result instanceof Error) {
        throw result;
      }
      return { stdout: result };
    },
  };
}

describe("custom installer source pin", () => {
  it("pins the custom repository URL and temporary release commit", () => {
    expect(CUSTOM_SOURCE_REPOSITORY_URL).toBe(
      "https://github.com/mooyama1701-sketch/line-harness-oss-custom.git",
    );
    expect(CUSTOM_SOURCE_COMMIT).toBe(
      "593781111c06837408eb33b3d0f25c72c747f6f0",
    );
    expect(isExpectedSourceRepositoryUrl(CUSTOM_SOURCE_REPOSITORY_URL)).toBe(
      true,
    );
  });

  it("accepts a clean existing repo with the custom origin", async () => {
    const { calls, git } = createGitRunner((args) => {
      if (args.join(" ") === "rev-parse --is-inside-work-tree") return "true";
      if (args.join(" ") === "remote get-url origin") {
        return CUSTOM_SOURCE_REPOSITORY_URL;
      }
      if (args.join(" ") === "status --porcelain") return "";
      throw new Error(`unexpected git call: ${args.join(" ")}`);
    });

    await expect(validateExistingSourceRepo("/repo", git)).resolves.toBeUndefined();

    expect(calls).toEqual([
      ["rev-parse", "--is-inside-work-tree"],
      ["remote", "get-url", "origin"],
      ["status", "--porcelain"],
    ]);
  });

  it("rejects official or different origins before changing files", async () => {
    const { calls, git } = createGitRunner((args) => {
      if (args.join(" ") === "rev-parse --is-inside-work-tree") return "true";
      if (args.join(" ") === "remote get-url origin") {
        return "https://github.com/Shudesu/line-harness-oss.git";
      }
      throw new Error(`unexpected git call: ${args.join(" ")}`);
    });

    await expect(validateExistingSourceRepo("/repo", git)).rejects.toThrow(
      "originが改造版リポジトリと一致しません",
    );

    expect(calls).toEqual([
      ["rev-parse", "--is-inside-work-tree"],
      ["remote", "get-url", "origin"],
    ]);
  });

  it("rejects repos without origin", async () => {
    const { git } = createGitRunner((args) => {
      if (args.join(" ") === "rev-parse --is-inside-work-tree") return "true";
      if (args.join(" ") === "remote get-url origin") {
        return new Error("No such remote 'origin'");
      }
      throw new Error(`unexpected git call: ${args.join(" ")}`);
    });

    await expect(validateExistingSourceRepo("/repo", git)).rejects.toThrow(
      "originがありません",
    );
  });

  it("rejects dirty worktrees without reset or clean", async () => {
    const { calls, git } = createGitRunner((args) => {
      if (args.join(" ") === "rev-parse --is-inside-work-tree") return "true";
      if (args.join(" ") === "remote get-url origin") {
        return CUSTOM_SOURCE_REPOSITORY_URL;
      }
      if (args.join(" ") === "status --porcelain") {
        return " M apps/worker/wrangler.toml";
      }
      throw new Error(`unexpected git call: ${args.join(" ")}`);
    });

    await expect(validateExistingSourceRepo("/repo", git)).rejects.toThrow(
      "未コミットの変更があります",
    );

    const flattened = calls.map((args) => args.join(" "));
    expect(flattened).not.toContain("reset --hard");
    expect(flattened).not.toContain("clean -fd");
    expect(flattened).not.toContain("pull --ff-only");
  });

  it("fetches, checks out detached HEAD, and verifies the pinned commit", async () => {
    const { calls, git } = createGitRunner((args) => {
      if (args.join(" ") === `fetch origin ${CUSTOM_SOURCE_COMMIT}`) return "";
      if (args.join(" ") === `checkout --detach ${CUSTOM_SOURCE_COMMIT}`) {
        return "";
      }
      if (args.join(" ") === "rev-parse HEAD") return CUSTOM_SOURCE_COMMIT;
      throw new Error(`unexpected git call: ${args.join(" ")}`);
    });

    await expect(checkoutPinnedSourceCommit("/repo", git)).resolves.toBeUndefined();

    expect(calls).toEqual([
      ["fetch", "origin", CUSTOM_SOURCE_COMMIT],
      ["checkout", "--detach", CUSTOM_SOURCE_COMMIT],
      ["rev-parse", "HEAD"],
    ]);
  });

  it("fails if checkout does not land on the pinned commit", async () => {
    const { git } = createGitRunner((args) => {
      if (args.join(" ") === `fetch origin ${CUSTOM_SOURCE_COMMIT}`) return "";
      if (args.join(" ") === `checkout --detach ${CUSTOM_SOURCE_COMMIT}`) {
        return "";
      }
      if (args.join(" ") === "rev-parse HEAD") {
        return "0000000000000000000000000000000000000000";
      }
      throw new Error(`unexpected git call: ${args.join(" ")}`);
    });

    await expect(checkoutPinnedSourceCommit("/repo", git)).rejects.toThrow(
      "checkout検証に失敗しました",
    );
  });
});
