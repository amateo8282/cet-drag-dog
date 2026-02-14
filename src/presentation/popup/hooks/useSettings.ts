import { useState, useEffect, useCallback } from "react";
import { MessageType } from "@/application/ports/messages";
import type { Settings } from "@/domain/Settings";
import { DEFAULT_SETTINGS } from "@/domain/Settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { type: MessageType.GET_SETTINGS },
      (response) => {
        if (response?.success) {
          setSettings(response.data);
        }
      },
    );
  }, []);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      chrome.runtime.sendMessage({
        type: MessageType.SAVE_SETTINGS,
        payload: updated,
      });
      return updated;
    });
  }, []);

  return { settings, updateSettings };
}
