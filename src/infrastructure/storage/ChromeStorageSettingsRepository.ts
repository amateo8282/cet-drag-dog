import type { SettingsRepository } from "@/application/ports/SettingsRepository";
import type { Settings } from "@/domain/Settings";
import { DEFAULT_SETTINGS } from "@/domain/Settings";

const STORAGE_KEY = "settings";

export class ChromeStorageSettingsRepository implements SettingsRepository {
  async get(): Promise<Settings> {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return { ...DEFAULT_SETTINGS, ...(result[STORAGE_KEY] as Partial<Settings>) };
  }

  async save(settings: Settings): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEY]: settings });
  }
}
