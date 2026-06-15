import { tmpdir } from "node:os";
import { join } from "node:path";

export const CUSTOM_LOCAL_REPO_DIR_NAME = ".line-harness-custom";
export const CUSTOM_SETUP_STATE_FILE = ".line-harness-custom-setup.json";
export const CUSTOM_INSTALL_CONFIG_FILE = ".line-harness-custom-config.json";
export const CUSTOM_MCP_SERVER_NAME = "line-harness-custom";

export function getCustomLocalRepoDir(
  env: { HOME?: string; USERPROFILE?: string } = process.env,
): string {
  return join(env.HOME || env.USERPROFILE || tmpdir(), CUSTOM_LOCAL_REPO_DIR_NAME);
}

export function getCustomSetupStatePath(repoDir: string): string {
  return join(repoDir, CUSTOM_SETUP_STATE_FILE);
}

export function getCustomInstallConfigPath(repoDir: string): string {
  return join(repoDir, CUSTOM_INSTALL_CONFIG_FILE);
}
