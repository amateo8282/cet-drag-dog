import { describe, it, expect, vi, beforeEach } from "vitest";
import { createToast } from "./Toast";

describe("Toast", () => {
  let shadowRoot: ShadowRoot;

  beforeEach(() => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    shadowRoot = host.attachShadow({ mode: "open" });
  });

  it("shadowRoot에 토스트 요소를 추가한다", () => {
    createToast(shadowRoot);
    const toast = shadowRoot.querySelector("div");
    expect(toast).not.toBeNull();
  });

  it("show 호출 시 메시지를 표시하고 슬라이드 인 한다", () => {
    const toast = createToast(shadowRoot);
    toast.show("테스트 메시지");

    const el = shadowRoot.querySelector("div") as HTMLDivElement;
    expect(el.textContent).toBe("테스트 메시지");
    expect(el.style.transform).toBe("translateX(0)");
  });

  it("기본 메시지로 표시할 수 있다", () => {
    const toast = createToast(shadowRoot);
    toast.show();

    const el = shadowRoot.querySelector("div") as HTMLDivElement;
    expect(el.textContent).toBe("멍! 물어왔어요!");
  });

  it("2초 후 자동으로 사라진다", () => {
    vi.useFakeTimers();
    const toast = createToast(shadowRoot);
    toast.show();

    const el = shadowRoot.querySelector("div") as HTMLDivElement;
    expect(el.style.transform).toBe("translateX(0)");

    vi.advanceTimersByTime(2000);
    expect(el.style.transform).toBe("translateX(120%)");

    vi.useRealTimers();
  });
});
