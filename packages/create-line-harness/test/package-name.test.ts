import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const packageDir = join(process.cwd(), "packages/create-line-harness");
const customSetupCommand = "npx @airestart/create-line-harness";
const legacyPublishedCommand = "npx create-line-harness@latest";

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

  it("uses the custom setup command in user-facing setup surfaces", () => {
    const userFacingFiles = [
      "apps/worker/src/routes/setup.ts",
      "docs/FORK_CLOUDFLARE_WORKFLOW.md",
      "docs/ADMIN-AUTH.md",
    ];

    for (const filePath of userFacingFiles) {
      const source = readFileSync(join(process.cwd(), filePath), "utf-8");

      expect(source, filePath).toContain(customSetupCommand);
      expect(source, filePath).not.toContain(legacyPublishedCommand);
      expect(source, filePath).not.toContain(
        "`create-line-harness` does this automatically",
      );
    }
  });

  it("uses the custom MCP npm package, CLI bin, and server name", () => {
    const mcpPackageJson = JSON.parse(
      readFileSync(join(process.cwd(), "packages/mcp-server/package.json"), "utf-8"),
    ) as {
      name: string;
      bin: Record<string, string>;
    };
    const mcpEntrySource = readFileSync(
      join(process.cwd(), "packages/mcp-server/src/index.ts"),
      "utf-8",
    );
    const mcpConfigSource = readFileSync(
      join(packageDir, "src/steps/mcp-config.ts"),
      "utf-8",
    );

    expect(mcpPackageJson.name).toBe("@airestart/line-harness-mcp-server");
    expect(mcpPackageJson.bin).toEqual({
      "line-harness-custom-mcp": "./dist/index.js",
    });
    expect(mcpEntrySource).toContain('name: "line-harness-custom"');
    expect(mcpEntrySource).toContain("LINE Harness Custom MCP Server running on stdio");
    expect(mcpConfigSource).toContain("@airestart/line-harness-mcp-server@latest");
    expect(mcpConfigSource).not.toContain("@line-harness/mcp-server@latest");
  });
});
