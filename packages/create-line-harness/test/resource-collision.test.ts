import { describe, expect, it, vi } from "vitest";
import {
  assertNoCloudflareResourceCollisions,
  CloudflareResourceCollisionError,
  findCloudflareResourceCollisions,
  parseR2BucketNames,
  type PlannedCloudflareResources,
} from "../src/steps/resource-collision";

const resources: PlannedCloudflareResources = {
  workerName: "line-harness",
  pagesProjectName: "line-harness-admin-12345678",
  d1DatabaseName: "line-harness",
  r2BucketName: "line-harness-images",
};

type WranglerOutput = string | Error;

function commandKey(args: string[]): string {
  return args.join(" ");
}

function makeRunner(overrides: Record<string, WranglerOutput> = {}) {
  const outputs: Record<string, WranglerOutput> = {
    [`versions list --name ${resources.workerName} --json`]: "[]",
    "pages project list --json": JSON.stringify([
      { name: "another-project-admin-12345678" },
    ]),
    "d1 list --json": JSON.stringify([{ name: "another-project" }]),
    "r2 bucket list": "Name Created\nanother-project-images 2026-01-01\n",
    ...overrides,
  };

  return vi.fn(async (args: string[]) => {
    const output = outputs[commandKey(args)];
    if (output === undefined) {
      throw new Error(`unexpected wrangler call: ${commandKey(args)}`);
    }
    if (output instanceof Error) throw output;
    return output;
  });
}

describe("Cloudflare resource collision guard", () => {
  it("continues only when all target resources are absent", async () => {
    const runWrangler = makeRunner();
    const nextStep = vi.fn();

    await assertNoCloudflareResourceCollisions(resources, runWrangler);
    nextStep();

    expect(nextStep).toHaveBeenCalledOnce();
    expect(runWrangler).toHaveBeenCalledTimes(4);
  });

  it("stops on an existing Worker with the same name", async () => {
    const runWrangler = makeRunner({
      [`versions list --name ${resources.workerName} --json`]: JSON.stringify([
        { id: "worker-version" },
      ]),
    });

    await expect(
      assertNoCloudflareResourceCollisions(resources, runWrangler),
    ).rejects.toThrow(/Worker: line-harness/);
  });

  it("stops on an existing Pages project with the same name", async () => {
    const runWrangler = makeRunner({
      "pages project list --json": JSON.stringify([
        { name: resources.pagesProjectName },
      ]),
    });

    await expect(
      assertNoCloudflareResourceCollisions(resources, runWrangler),
    ).rejects.toThrow(/Pages project: line-harness-admin-12345678/);
  });

  it("stops on an existing D1 database with the same name", async () => {
    const runWrangler = makeRunner({
      "d1 list --json": JSON.stringify([{ name: resources.d1DatabaseName }]),
    });

    await expect(
      assertNoCloudflareResourceCollisions(resources, runWrangler),
    ).rejects.toThrow(/D1 database: line-harness/);
  });

  it("stops on an existing R2 bucket with the same name", async () => {
    const runWrangler = makeRunner({
      "r2 bucket list": `Name Created\n${resources.r2BucketName} 2026-01-01\n`,
    });

    await expect(
      assertNoCloudflareResourceCollisions(resources, runWrangler),
    ).rejects.toThrow(/R2 bucket: line-harness-images/);
  });

  it("reports multiple matching resources together", async () => {
    const runWrangler = makeRunner({
      [`versions list --name ${resources.workerName} --json`]: JSON.stringify([
        { id: "worker-version" },
      ]),
      "pages project list --json": JSON.stringify([
        { name: resources.pagesProjectName },
      ]),
      "d1 list --json": JSON.stringify([{ name: resources.d1DatabaseName }]),
      "r2 bucket list": `Name Created\n${resources.r2BucketName} 2026-01-01\n`,
    });

    const result = await findCloudflareResourceCollisions(resources, runWrangler);

    expect(result.failures).toEqual([]);
    expect(result.collisions).toEqual([
      { type: "Worker", name: resources.workerName },
      { type: "Pages project", name: resources.pagesProjectName },
      { type: "D1 database", name: resources.d1DatabaseName },
      { type: "R2 bucket", name: resources.r2BucketName },
    ]);
  });

  it("does not treat partial name matches as collisions", async () => {
    const runWrangler = makeRunner({
      [`versions list --name ${resources.workerName} --json`]: "[]",
      "pages project list --json": JSON.stringify([
        { name: `${resources.pagesProjectName}-old` },
      ]),
      "d1 list --json": JSON.stringify([{ name: `${resources.d1DatabaseName}-old` }]),
      "r2 bucket list": `Name Created\n${resources.r2BucketName}-old 2026-01-01\n`,
    });

    await expect(
      assertNoCloudflareResourceCollisions(resources, runWrangler),
    ).resolves.toBeUndefined();
  });

  it("does not run create, deploy, or migration callbacks after a collision", async () => {
    const runWrangler = makeRunner({
      "d1 list --json": JSON.stringify([{ name: resources.d1DatabaseName }]),
    });
    const createResource = vi.fn();
    const deployResource = vi.fn();
    const runMigration = vi.fn();

    await expect(
      assertNoCloudflareResourceCollisions(resources, runWrangler),
    ).rejects.toBeInstanceOf(CloudflareResourceCollisionError);

    expect(createResource).not.toHaveBeenCalled();
    expect(deployResource).not.toHaveBeenCalled();
    expect(runMigration).not.toHaveBeenCalled();
  });

  it("stops when a resource check command fails", async () => {
    const runWrangler = makeRunner({
      "pages project list --json": new Error("authentication failed"),
    });

    await expect(
      assertNoCloudflareResourceCollisions(resources, runWrangler),
    ).rejects.toThrow(/存在確認に失敗/);
  });

  it("stops when a resource list output cannot be parsed", async () => {
    const runWrangler = makeRunner({
      "d1 list --json": "{not valid json",
    });

    await expect(
      assertNoCloudflareResourceCollisions(resources, runWrangler),
    ).rejects.toThrow(/存在確認に失敗/);
  });

  it("stops when R2 bucket list output is not a recognizable list", () => {
    expect(() => parseR2BucketNames("this is not a bucket list")).toThrow(
      /R2 bucket 一覧の形式が想定外です/,
    );
  });
});
