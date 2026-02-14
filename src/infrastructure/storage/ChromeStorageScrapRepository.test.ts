import { describe, it, expect, beforeEach, vi } from "vitest";
import { ChromeStorageScrapRepository } from "./ChromeStorageScrapRepository";
import { createScrapItem } from "@/domain/ScrapItem";

// chrome.storage.local Mock
let store: Record<string, unknown> = {};

const chromeMock = {
  storage: {
    local: {
      get: vi.fn((keys: string | string[]) => {
        const key = typeof keys === "string" ? keys : keys[0];
        return Promise.resolve({ [key]: store[key] });
      }),
      set: vi.fn((items: Record<string, unknown>) => {
        Object.assign(store, items);
        return Promise.resolve();
      }),
    },
  },
};

vi.stubGlobal("chrome", chromeMock);

describe("ChromeStorageScrapRepository", () => {
  let repo: ChromeStorageScrapRepository;

  beforeEach(() => {
    store = {};
    vi.clearAllMocks();
    repo = new ChromeStorageScrapRepository();
  });

  it("아이템을 저장하고 조회할 수 있다", async () => {
    const item = createScrapItem({
      text: "테스트",
      sourceUrl: "https://example.com",
      sourceTitle: "예시",
    });

    await repo.save(item);
    const items = await repo.getAll();

    expect(items).toHaveLength(1);
    expect(items[0].text).toBe("테스트");
    expect(items[0].id).toBe(item.id);
  });

  it("Date가 직렬화/역직렬화된다", async () => {
    const item = createScrapItem({
      text: "날짜 테스트",
      sourceUrl: "https://example.com",
      sourceTitle: "예시",
    });

    await repo.save(item);
    const items = await repo.getAll();

    expect(items[0].createdAt).toBeInstanceOf(Date);
    expect(items[0].createdAt.getTime()).toBe(item.createdAt.getTime());
  });

  it("최신 아이템이 앞에 온다", async () => {
    const first = createScrapItem({
      text: "첫 번째",
      sourceUrl: "https://a.com",
      sourceTitle: "A",
    });
    const second = createScrapItem({
      text: "두 번째",
      sourceUrl: "https://b.com",
      sourceTitle: "B",
    });

    await repo.save(first);
    await repo.save(second);
    const items = await repo.getAll();

    expect(items[0].text).toBe("두 번째");
    expect(items[1].text).toBe("첫 번째");
  });

  it("id로 아이템을 삭제한다", async () => {
    const item = createScrapItem({
      text: "삭제할 항목",
      sourceUrl: "https://example.com",
      sourceTitle: "예시",
    });

    await repo.save(item);
    await repo.delete(item.id);
    const items = await repo.getAll();

    expect(items).toHaveLength(0);
  });

  it("텍스트와 제목으로 검색한다", async () => {
    await repo.save(
      createScrapItem({
        text: "리액트 튜토리얼",
        sourceUrl: "https://a.com",
        sourceTitle: "React Docs",
      }),
    );
    await repo.save(
      createScrapItem({
        text: "타입스크립트 설정",
        sourceUrl: "https://b.com",
        sourceTitle: "TS Guide",
      }),
    );

    const byText = await repo.search("리액트");
    expect(byText).toHaveLength(1);
    expect(byText[0].text).toBe("리액트 튜토리얼");

    const byTitle = await repo.search("TS Guide");
    expect(byTitle).toHaveLength(1);
  });

  it("저장소가 비어있을 때 빈 배열을 반환한다", async () => {
    const items = await repo.getAll();
    expect(items).toEqual([]);
  });
});
