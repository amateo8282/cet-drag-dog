import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SettingsPanel } from "./SettingsPanel";

vi.stubGlobal("chrome", {
  runtime: {
    sendMessage: vi.fn((_msg, callback) => {
      if (callback) {
        callback({
          success: true,
          data: { animationEnabled: true, toastEnabled: true, soundEnabled: true },
        });
      }
    }),
  },
});

describe("SettingsPanel", () => {
  it("설정 제목을 표시한다", () => {
    render(<SettingsPanel />);
    expect(screen.getByText("설정")).toBeInTheDocument();
  });

  it("애니메이션 토글을 표시한다", () => {
    render(<SettingsPanel />);
    expect(screen.getByText("리트리버 애니메이션")).toBeInTheDocument();
  });

  it("효과음 토글을 표시한다", () => {
    render(<SettingsPanel />);
    expect(screen.getByText("효과음")).toBeInTheDocument();
  });

  it("토스트 토글을 표시한다", () => {
    render(<SettingsPanel />);
    expect(screen.getByText("토스트 알림")).toBeInTheDocument();
  });
});
