import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const packageDir = join(process.cwd(), "packages/create-line-harness");

describe("custom setup package metadata", () => {
  it("uses the custom npm package and CLI bin names", () => {
    const packageJson = JSON.parse(
      readFileSync(join(packageDir, "package.json"), "utf-8"),
    ) as {
      name: string;
      bin: Record<string, string>;
    };

    expect(packageJson.name).toBe("@airestart/create-line-harness");
    expect(packageJson.bin).toEqual({
      "create-line-harness-custom": "./dist/index.js",
    });
  });

  it("documents the custom CLI name in usage output", () => {
    const entrySource = readFileSync(join(packageDir, "src/index.ts"), "utf-8");

    expect(entrySource).toContain("Usage: create-line-harness-custom");
    expect(entrySource).not.toContain("Usage: create-line-harness ");
  });

  it("uses the custom package name in the source publish guard", () => {
    let stderr = "";

    try {
      execFileSync("node", [join(packageDir, "scripts/guard-source-publish.mjs")], {
        cwd: process.cwd(),
        encoding: "utf-8",
        env: {
          ...process.env,
          npm_config_user_agent: "npm/11.0.0",
        },
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (error) {
      stderr = String((error as { stderr?: string }).stderr ?? "");
    }

    expect(stderr).toContain(
      "Refusing to publish @airestart/create-line-harness from source with npm.",
    );
    expect(stderr).toContain("airestart-create-line-harness-<version>.tgz");
    expect(stderr).not.toContain(
      "npm publish <dir>/create-line-harness-<version>.tgz",
    );
  });
});
