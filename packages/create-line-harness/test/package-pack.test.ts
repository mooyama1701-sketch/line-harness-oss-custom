import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  mkdirSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";

const packageDir = join(process.cwd(), "packages/create-line-harness");

function archiveName(name: string, version: string): string {
  return `${name.replace("@", "").replace("/", "-")}-${version}.tgz`;
}

describe("custom setup package pack output", () => {
  it("uses pnpm pack to convert workspace dependencies to publishable versions", () => {
    const packageJson = JSON.parse(
      readFileSync(join(packageDir, "package.json"), "utf-8"),
    ) as {
      name: string;
      version: string;
    };
    const tempDir = mkdtempSync(join(tmpdir(), "create-line-harness-pack-"));
    const packDir = join(tempDir, "pack");
    const extractDir = join(tempDir, "extract");

    try {
      mkdirSync(packDir);
      mkdirSync(extractDir);

      execFileSync("pnpm", ["pack", "--pack-destination", packDir], {
        cwd: packageDir,
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "pipe"],
      });

      const tarballPath = join(
        packDir,
        archiveName(packageJson.name, packageJson.version),
      );
      expect(existsSync(tarballPath)).toBe(true);

      execFileSync("tar", ["-xzf", tarballPath, "-C", extractDir], {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "pipe"],
      });

      const packedPackageJson = JSON.parse(
        readFileSync(join(extractDir, "package/package.json"), "utf-8"),
      ) as {
        dependencies?: Record<string, string>;
      };

      expect(packedPackageJson.dependencies?.["@line-harness/update-engine"]).toBe(
        "^0.0.2",
      );
      expect(JSON.stringify(packedPackageJson.dependencies)).not.toContain(
        "workspace:",
      );
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
