import { describe, expect, it } from "vitest";
import {
  isUpdateEnabled,
  UPDATE_DISABLED_MESSAGE,
} from "../src/commands/update";

describe("custom initial release update policy", () => {
  it("keeps CLI update disabled in code", () => {
    expect(isUpdateEnabled()).toBe(false);
  });

  it("explains that automatic updates are unavailable", () => {
    expect(UPDATE_DISABLED_MESSAGE).toContain("初期リリース");
    expect(UPDATE_DISABLED_MESSAGE).toContain("自動更新機能は利用できません");
    expect(UPDATE_DISABLED_MESSAGE).toContain("updateコマンドを実行しないでください");
  });
});
