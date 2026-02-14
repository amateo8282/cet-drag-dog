import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRetrieverAnimation } from "./RetrieverAnimation";

describe("RetrieverAnimation", () => {
  let shadowRoot: ShadowRoot;

  beforeEach(() => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    shadowRoot = host.attachShadow({ mode: "open" });
  });

  it("shadowRoot에 컨테이너를 추가한다", () => {
    createRetrieverAnimation(shadowRoot);
    const container = shadowRoot.querySelector("div");
    expect(container).not.toBeNull();
  });

  it("play 호출 시 컨테이너가 표시된다", async () => {
    vi.useFakeTimers();
    const anim = createRetrieverAnimation(shadowRoot);
    const container = shadowRoot.querySelector("div") as HTMLDivElement;

    expect(container.style.display).toBe("none");

    const playPromise = anim.play({ x: 200, y: 200 });

    // play 시작 시 display가 block으로 변경
    expect(container.style.display).toBe("block");

    // 완료 대기
    vi.advanceTimersByTime(3000);
    await playPromise;

    expect(container.style.display).toBe("none");
    vi.useRealTimers();
  });
});
