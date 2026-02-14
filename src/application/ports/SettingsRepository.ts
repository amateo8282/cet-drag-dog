import type { Settings } from "@/domain/Settings";

export interface SettingsRepository {
  get(): Promise<Settings>;
  save(settings: Settings): Promise<void>;
}
