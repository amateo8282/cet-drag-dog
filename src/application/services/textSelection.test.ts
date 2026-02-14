import { describe, it, expect, vi } from "vitest";
import { getTextSelection } from "./textSelection";

describe("getTextSelection", () => {
  it("선택 없으면 null을 반환한다", () => {
    vi.spyOn(window, "getSelection").mockReturnValue(null);
    expect(getTextSelection()).toBeNull();
  });

  it("선택이 collapsed이면 null을 반환한다", () => {
    vi.spyOn(window, "getSelection").mockReturnValue({
      isCollapsed: true,
      toString: () => "",
    } as unknown as Selection);
    expect(getTextSelection()).toBeNull();
  });

  it("공백만 선택하면 null을 반환한다", () => {
    vi.spyOn(window, "getSelection").mockReturnValue({
      isCollapsed: false,
      toString: () => "   ",
      getRangeAt: () => ({
        getBoundingClientRect: () => new DOMRect(0, 0, 100, 20),
      }),
    } as unknown as Selection);
    expect(getTextSelection()).toBeNull();
  });

  it("텍스트 선택 시 text와 rect를 반환한다", () => {
    const mockRect = new DOMRect(100, 200, 150, 20);
    vi.spyOn(window, "getSelection").mockReturnValue({
      isCollapsed: false,
      toString: () => "선택된 텍스트",
      getRangeAt: () => ({
        getBoundingClientRect: () => mockRect,
      }),
    } as unknown as Selection);

    const result = getTextSelection();
    expect(result).not.toBeNull();
    expect(result!.text).toBe("선택된 텍스트");
    expect(result!.rect).toBe(mockRect);
  });
});
