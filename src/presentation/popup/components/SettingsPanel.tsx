import { Switch } from "./ui/switch";
import { useSettings } from "../hooks/useSettings";

export function SettingsPanel() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-4 p-4 border-t">
      <h2 className="text-sm font-semibold">설정</h2>
      <div className="flex items-center justify-between">
        <label htmlFor="animation-toggle" className="text-sm">
          리트리버 애니메이션
        </label>
        <Switch
          id="animation-toggle"
          checked={settings.animationEnabled}
          onCheckedChange={(checked) =>
            updateSettings({ animationEnabled: checked })
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <label htmlFor="toast-toggle" className="text-sm">
          토스트 알림
        </label>
        <Switch
          id="toast-toggle"
          checked={settings.toastEnabled}
          onCheckedChange={(checked) =>
            updateSettings({ toastEnabled: checked })
          }
        />
      </div>
    </div>
  );
}
