import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  CUSTOM_INSTALL_CONFIG_FILE,
  CUSTOM_LOCAL_REPO_DIR_NAME,
  CUSTOM_MCP_SERVER_NAME,
  CUSTOM_SETUP_STATE_FILE,
  getCustomInstallConfigPath,
  getCustomLocalRepoDir,
  getCustomSetupStatePath,
} from "../src/lib/custom-names";
import { loadState } from "../src/commands/update";
import { generateMcpConfig } from "../src/steps/mcp-config";

const tempDirs: string[] = [];
const originalCwd = process.cwd();

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "line-harness-custom-test-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  process.chdir(originalCwd);
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe("custom local name isolation", () => {
  it("uses the custom clone directory under HOME", () => {
    const home = makeTempDir();

    expect(getCustomLocalRepoDir({ HOME: home })).toBe(
      join(home, CUSTOM_LOCAL_REPO_DIR_NAME),
    );
    expect(getCustomLocalRepoDir({ HOME: home })).not.toBe(
      join(home, ".line-harness"),
    );
  });

  it("uses custom setup state and install config filenames", () => {
    const repoDir = makeTempDir();

    expect(getCustomSetupStatePath(repoDir)).toBe(
      join(repoDir, CUSTOM_SETUP_STATE_FILE),
    );
    expect(getCustomInstallConfigPath(repoDir)).toBe(
      join(repoDir, CUSTOM_INSTALL_CONFIG_FILE),
    );
    expect(getCustomSetupStatePath(repoDir)).not.toBe(
      join(repoDir, ".line-harness-setup.json"),
    );
    expect(getCustomInstallConfigPath(repoDir)).not.toBe(
      join(repoDir, ".line-harness-config.json"),
    );
  });

  it("loads only the custom install config even when official config exists", () => {
    const repoDir = makeTempDir();
    const officialConfigPath = join(repoDir, ".line-harness-config.json");
    const customConfigPath = getCustomInstallConfigPath(repoDir);
    const officialConfig = JSON.stringify({ projectName: "official-project" }, null, 2) + "\n";
    const customConfig = JSON.stringify({ projectName: "custom-project" }, null, 2) + "\n";
    writeFileSync(officialConfigPath, officialConfig);
    writeFileSync(customConfigPath, customConfig);

    expect(loadState(repoDir)?.projectName).toBe("custom-project");
    expect(readFileSync(officialConfigPath, "utf-8")).toBe(officialConfig);
  });

  it("does not read official install config when custom config is absent", () => {
    const repoDir = makeTempDir();
    const officialConfigPath = join(repoDir, ".line-harness-config.json");
    const officialConfig = JSON.stringify({ projectName: "official-project" }, null, 2) + "\n";
    writeFileSync(officialConfigPath, officialConfig);

    expect(loadState(repoDir)).toBeNull();
    expect(readFileSync(officialConfigPath, "utf-8")).toBe(officialConfig);
  });

  it("preserves official and unrelated MCP registrations while adding custom", () => {
    const repoDir = makeTempDir();
    process.chdir(repoDir);
    writeFileSync(
      join(repoDir, ".mcp.json"),
      JSON.stringify(
        {
          mcpServers: {
            "line-harness": {
              command: "npx",
              args: ["-y", "@line-harness/mcp-server@latest"],
              env: {
                LINE_HARNESS_API_URL: "https://official.example.test",
                LINE_HARNESS_API_KEY: "official-key",
              },
            },
            another: {
              command: "node",
              args: ["server.js"],
            },
          },
        },
        null,
        2,
      ) + "\n",
    );

    generateMcpConfig({
      workerUrl: "https://custom.example.test",
      apiKey: "custom-key",
    });

    const mcpConfig = JSON.parse(readFileSync(join(repoDir, ".mcp.json"), "utf-8"));
    expect(mcpConfig.mcpServers["line-harness"].env.LINE_HARNESS_API_URL).toBe(
      "https://official.example.test",
    );
    expect(mcpConfig.mcpServers.another.command).toBe("node");
    expect(mcpConfig.mcpServers[CUSTOM_MCP_SERVER_NAME]).toMatchObject({
      command: "npx",
      args: ["-y", "@line-harness/mcp-server@latest"],
      env: {
        LINE_HARNESS_API_URL: "https://custom.example.test",
        LINE_HARNESS_API_KEY: "custom-key",
      },
    });
  });

  it("updates the custom MCP registration without touching official registration", () => {
    const repoDir = makeTempDir();
    process.chdir(repoDir);
    writeFileSync(
      join(repoDir, ".mcp.json"),
      JSON.stringify(
        {
          mcpServers: {
            "line-harness": {
              command: "npx",
              args: ["-y", "@line-harness/mcp-server@latest"],
              env: {
                LINE_HARNESS_API_URL: "https://official.example.test",
                LINE_HARNESS_API_KEY: "official-key",
              },
            },
            [CUSTOM_MCP_SERVER_NAME]: {
              command: "npx",
              args: ["-y", "@line-harness/mcp-server@latest"],
              env: {
                LINE_HARNESS_API_URL: "https://old-custom.example.test",
                LINE_HARNESS_API_KEY: "old-custom-key",
              },
            },
          },
        },
        null,
        2,
      ) + "\n",
    );

    generateMcpConfig({
      workerUrl: "https://new-custom.example.test",
      apiKey: "new-custom-key",
    });

    const mcpConfig = JSON.parse(readFileSync(join(repoDir, ".mcp.json"), "utf-8"));
    expect(mcpConfig.mcpServers["line-harness"].env.LINE_HARNESS_API_KEY).toBe(
      "official-key",
    );
    expect(mcpConfig.mcpServers[CUSTOM_MCP_SERVER_NAME].env).toEqual({
      LINE_HARNESS_API_URL: "https://new-custom.example.test",
      LINE_HARNESS_API_KEY: "new-custom-key",
    });
  });
});
