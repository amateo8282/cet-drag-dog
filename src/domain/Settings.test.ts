import { describe, it, expect } from "vitest";
import { DEFAULT_SETTINGS } from "./Settings";

describe("Settings", () => {
  it("기본값으로 애니메이션, 토스트, 효과음이 활성화되어 있다", () => {
    expect(DEFAULT_SETTINGS.animationEnabled).toBe(true);
    expect(DEFAULT_SETTINGS.toastEnabled).toBe(true);
    expect(DEFAULT_SETTINGS.soundEnabled).toBe(true);
  });
});
