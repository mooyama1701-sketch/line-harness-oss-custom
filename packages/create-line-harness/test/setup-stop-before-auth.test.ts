import { afterEach, describe, expect, it, vi } from "vitest";
import {
  runSetupInner,
  SETUP_STOP_BEFORE_CLOUDFLARE_AUTH_ENV,
  shouldStopBeforeCloudflareAuth,
  type SetupState,
} from "../src/commands/setup";

const originalStopValue = process.env[SETUP_STOP_BEFORE_CLOUDFLARE_AUTH_ENV];

afterEach(() => {
  if (originalStopValue === undefined) {
    delete process.env[SETUP_STOP_BEFORE_CLOUDFLARE_AUTH_ENV];
  } else {
    process.env[SETUP_STOP_BEFORE_CLOUDFLARE_AUTH_ENV] = originalStopValue;
  }
});

function emptyState(): SetupState {
  return { completedSteps: [] };
}

describe("setup stop before Cloudflare auth mode", () => {
  it("is disabled unless the verification env var is explicitly enabled", () => {
    expect(shouldStopBeforeCloudflareAuth({})).toBe(false);
    expect(
      shouldStopBeforeCloudflareAuth({
        [SETUP_STOP_BEFORE_CLOUDFLARE_AUTH_ENV]: "0",
      }),
    ).toBe(false);
    expect(
      shouldStopBeforeCloudflareAuth({
        [SETUP_STOP_BEFORE_CLOUDFLARE_AUTH_ENV]: "1",
      }),
    ).toBe(true);
    expect(
      shouldStopBeforeCloudflareAuth({
        [SETUP_STOP_BEFORE_CLOUDFLARE_AUTH_ENV]: "true",
      }),
    ).toBe(true);
  });

  it("stops after dependency checks and before Cloudflare auth", async () => {
    process.env[SETUP_STOP_BEFORE_CLOUDFLARE_AUTH_ENV] = "1";
    const checkDeps = vi.fn(async () => undefined);
    const ensureAuth = vi.fn(async () => undefined);

    await expect(
      runSetupInner(emptyState(), "/repo", { checkDeps, ensureAuth }),
    ).resolves.toBe("stoppedBeforeCloudflareAuth");

    expect(checkDeps).toHaveBeenCalledOnce();
    expect(ensureAuth).not.toHaveBeenCalled();
  });

  it("keeps the normal setup path going to Cloudflare auth", async () => {
    delete process.env[SETUP_STOP_BEFORE_CLOUDFLARE_AUTH_ENV];
    const checkDeps = vi.fn(async () => undefined);
    const ensureAuth = vi.fn(async () => {
      throw new Error("ensureAuth called");
    });

    await expect(
      runSetupInner(emptyState(), "/repo", { checkDeps, ensureAuth }),
    ).rejects.toThrow("ensureAuth called");

    expect(checkDeps).toHaveBeenCalledOnce();
    expect(ensureAuth).toHaveBeenCalledOnce();
  });
});
