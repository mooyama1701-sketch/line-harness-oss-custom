import { wrangler } from "../lib/wrangler.js";

export type CloudflareResourceType = "Worker" | "Pages project" | "D1 database" | "R2 bucket";

export interface PlannedCloudflareResources {
  workerName: string;
  pagesProjectName: string;
  d1DatabaseName: string;
  r2BucketName: string;
}

export interface CloudflareResourceCollision {
  type: CloudflareResourceType;
  name: string;
}

export interface CloudflareResourceCheckFailure {
  type: CloudflareResourceType;
  name: string;
  reason: string;
}

export class CloudflareResourceCollisionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudflareResourceCollisionError";
  }
}

type WranglerRunner = (args: string[]) => Promise<string>;

function parseJsonItems(output: string, resourceType: CloudflareResourceType): unknown[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(output);
  } catch {
    throw new Error(`${resourceType} 一覧のJSON解析に失敗しました`);
  }

  if (Array.isArray(parsed)) return parsed;
  if (
    parsed &&
    typeof parsed === "object" &&
    "result" in parsed &&
    Array.isArray((parsed as { result: unknown }).result)
  ) {
    return (parsed as { result: unknown[] }).result;
  }

  throw new Error(`${resourceType} 一覧の形式が想定外です`);
}

function getStringField(item: unknown, fields: string[]): string | null {
  if (!item || typeof item !== "object") return null;
  const record = item as Record<string, unknown>;
  for (const field of fields) {
    const value = record[field];
    if (typeof value === "string") return value;
  }
  return null;
}

function jsonListHasExactName(
  output: string,
  resourceType: CloudflareResourceType,
  targetName: string,
  fields: string[],
): boolean {
  return parseJsonItems(output, resourceType).some(
    (item) => getStringField(item, fields) === targetName,
  );
}

function stripAnsi(value: string): string {
  return value.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "");
}

export function parseR2BucketNames(output: string): string[] {
  const trimmed = stripAnsi(output).trim();
  if (!trimmed) return [];

  try {
    return parseJsonItems(trimmed, "R2 bucket")
      .map((item) => getStringField(item, ["name", "bucket", "bucket_name"]))
      .filter((name): name is string => Boolean(name));
  } catch {
    // Wrangler 4.77 does not advertise --json for `r2 bucket list`, so fall
    // back to parsing its table output. If this shape changes, fail closed.
  }

  const names: string[] = [];
  const lines = trimmed.split(/\r?\n/);
  let sawTableShape = false;
  for (const line of lines) {
    const compact = line.trim();
    if (/^(name|bucket)\b/i.test(compact)) {
      sawTableShape = true;
      continue;
    }
    if (
      !compact ||
      /^[-+│| ]+$/.test(compact) ||
      /^(name|bucket|created|creation)/i.test(compact)
    ) {
      continue;
    }

    if (compact.includes("│")) {
      sawTableShape = true;
      const cells = compact
        .split("│")
        .map((cell) => cell.trim())
        .filter(Boolean);
      if (cells[0] && !/^(name|bucket)$/i.test(cells[0])) {
        names.push(cells[0]);
      }
      continue;
    }

    if (compact.includes("|")) {
      sawTableShape = true;
      const cells = compact
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean);
      if (cells[0] && !/^(name|bucket)$/i.test(cells[0])) {
        names.push(cells[0]);
      }
      continue;
    }

    if (sawTableShape) {
      const first = compact.split(/\s+/)[0];
      if (first && !/^(name|bucket)$/i.test(first)) {
        names.push(first);
      }
    }
  }

  if (!sawTableShape) {
    throw new Error("R2 bucket 一覧の形式が想定外です");
  }

  return names;
}

function formatFailures(failures: CloudflareResourceCheckFailure[]): string {
  return [
    "Cloudflareリソースの存在確認に失敗したため、setupを停止しました。",
    "",
    ...failures.map(
      (failure) =>
        `- ${failure.type}: ${failure.name}\n  理由: ${failure.reason}`,
    ),
    "",
    "安全のため、作成・更新・deploy・migrationは実行していません。",
    "Cloudflareの認証状態やwranglerの出力を確認してから再実行してください。",
  ].join("\n");
}

export function formatCollisionMessage(
  collisions: CloudflareResourceCollision[],
): string {
  return [
    "Cloudflare上に同名の既存リソースが見つかったため、setupを停止しました。",
    "",
    ...collisions.map((collision) => `- ${collision.type}: ${collision.name}`),
    "",
    "既存リソースを保護するため、作成・更新・deploy・migrationは実行していません。",
    "別のプロジェクト名を指定するか、Cloudflare Dashboardで既存リソースを確認してください。",
  ].join("\n");
}

async function checkOne(
  type: CloudflareResourceType,
  name: string,
  fn: () => Promise<boolean>,
): Promise<{
  collision?: CloudflareResourceCollision;
  failure?: CloudflareResourceCheckFailure;
}> {
  try {
    return (await fn()) ? { collision: { type, name } } : {};
  } catch (error) {
    return {
      failure: {
        type,
        name,
        reason: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

export async function findCloudflareResourceCollisions(
  resources: PlannedCloudflareResources,
  runWrangler: WranglerRunner = wrangler,
): Promise<{
  collisions: CloudflareResourceCollision[];
  failures: CloudflareResourceCheckFailure[];
}> {
  const checks = await Promise.all([
    checkOne("Worker", resources.workerName, async () => {
      const output = await runWrangler([
        "versions",
        "list",
        "--name",
        resources.workerName,
        "--json",
      ]);
      return parseJsonItems(output, "Worker").length > 0;
    }),
    checkOne("Pages project", resources.pagesProjectName, async () => {
      const output = await runWrangler(["pages", "project", "list", "--json"]);
      return jsonListHasExactName(output, "Pages project", resources.pagesProjectName, [
        "name",
        "project_name",
      ]);
    }),
    checkOne("D1 database", resources.d1DatabaseName, async () => {
      const output = await runWrangler(["d1", "list", "--json"]);
      return jsonListHasExactName(output, "D1 database", resources.d1DatabaseName, [
        "name",
        "database_name",
      ]);
    }),
    checkOne("R2 bucket", resources.r2BucketName, async () => {
      const output = await runWrangler(["r2", "bucket", "list"]);
      return parseR2BucketNames(output).includes(resources.r2BucketName);
    }),
  ]);

  return {
    collisions: checks.flatMap((check) => check.collision ?? []),
    failures: checks.flatMap((check) => check.failure ?? []),
  };
}

export async function assertNoCloudflareResourceCollisions(
  resources: PlannedCloudflareResources,
  runWrangler: WranglerRunner = wrangler,
): Promise<void> {
  const result = await findCloudflareResourceCollisions(resources, runWrangler);

  if (result.failures.length > 0) {
    throw new CloudflareResourceCollisionError(formatFailures(result.failures));
  }

  if (result.collisions.length > 0) {
    throw new CloudflareResourceCollisionError(
      formatCollisionMessage(result.collisions),
    );
  }
}
