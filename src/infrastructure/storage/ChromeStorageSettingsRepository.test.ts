import { describe, it, expect, beforeEach, vi } from "vitest";
import { ChromeStorageSettingsRepository } from "./ChromeStorageSettingsRepository";

let store: Record<string, unknown> = {};

vi.stubGlobal("chrome", {
  storage: {
    local: {
      get: vi.fn((keys: string) => Promise.resolve({ [keys]: store[keys] })),
      set: vi.fn((items: Record<string, unknown>) => {
        Object.assign(store, items);
        return Promise.resolve();
      }),
    },
  },
});

describe("ChromeStorageSettingsRepository", () => {
  let repo: ChromeStorageSettingsRepository;

  beforeEach(() => {
    store = {};
    vi.clearAllMocks();
    repo = new ChromeStorageSettingsRepository();
  });

  it("저장소가 비어있으면 기본값을 반환한다", async () => {
    const settings = await repo.get();
    expect(settings.animationEnabled).toBe(true);
    expect(settings.toastEnabled).toBe(true);
  });

  it("설정을 저장하고 불러온다", async () => {
    await repo.save({ animationEnabled: false, toastEnabled: true, soundEnabled: true });
    const settings = await repo.get();
    expect(settings.animationEnabled).toBe(false);
    expect(settings.toastEnabled).toBe(true);
  });
});
