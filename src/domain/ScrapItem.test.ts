import { describe, it, expect } from "vitest";
import { createScrapItem } from "./ScrapItem";

describe("ScrapItem", () => {
  it("필수 필드로 생성할 수 있다", () => {
    const item = createScrapItem({
      text: "안녕하세요",
      sourceUrl: "https://example.com",
      sourceTitle: "예시 페이지",
    });

    expect(item.id).toBeDefined();
    expect(item.text).toBe("안녕하세요");
    expect(item.sourceUrl).toBe("https://example.com");
    expect(item.sourceTitle).toBe("예시 페이지");
    expect(item.createdAt).toBeInstanceOf(Date);
    expect(item.tags).toEqual([]);
  });

  it("빈 텍스트로 생성하면 에러가 발생한다", () => {
    expect(() =>
      createScrapItem({
        text: "",
        sourceUrl: "https://example.com",
        sourceTitle: "예시",
      }),
    ).toThrow("텍스트는 비어있을 수 없습니다");
  });

  it("공백만 있는 텍스트로 생성하면 에러가 발생한다", () => {
    expect(() =>
      createScrapItem({
        text: "   ",
        sourceUrl: "https://example.com",
        sourceTitle: "예시",
      }),
    ).toThrow("텍스트는 비어있을 수 없습니다");
  });

  it("tags를 지정할 수 있다", () => {
    const item = createScrapItem({
      text: "태그 테스트",
      sourceUrl: "https://example.com",
      sourceTitle: "예시",
      tags: ["중요", "메모"],
    });

    expect(item.tags).toEqual(["중요", "메모"]);
  });

  it("각 아이템은 고유한 id를 가진다", () => {
    const item1 = createScrapItem({
      text: "첫 번째",
      sourceUrl: "https://example.com",
      sourceTitle: "예시",
    });
    const item2 = createScrapItem({
      text: "두 번째",
      sourceUrl: "https://example.com",
      sourceTitle: "예시",
    });

    expect(item1.id).not.toBe(item2.id);
  });
});
