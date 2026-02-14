import { describe, it, expect, beforeEach } from "vitest";
import type { ScrapRepository } from "@/application/ports/ScrapRepository";
import type { ScrapItem } from "@/domain/ScrapItem";
import { SaveScrapUseCase } from "./SaveScrapUseCase";
import { GetAllScrapsUseCase } from "./GetAllScrapsUseCase";
import { DeleteScrapUseCase } from "./DeleteScrapUseCase";
import { SearchScrapsUseCase } from "./SearchScrapsUseCase";

class MockScrapRepository implements ScrapRepository {
  items: ScrapItem[] = [];

  async save(item: ScrapItem) {
    this.items.push(item);
  }

  async getAll() {
    return [...this.items];
  }

  async delete(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  async search(query: string) {
    return this.items.filter((item) =>
      item.text.toLowerCase().includes(query.toLowerCase()),
    );
  }
}

describe("SaveScrapUseCase", () => {
  let repository: MockScrapRepository;
  let useCase: SaveScrapUseCase;

  beforeEach(() => {
    repository = new MockScrapRepository();
    useCase = new SaveScrapUseCase(repository);
  });

  it("스크랩을 저장하고 반환한다", async () => {
    const result = await useCase.execute({
      text: "테스트 텍스트",
      sourceUrl: "https://example.com",
      sourceTitle: "예시",
    });

    expect(result.text).toBe("테스트 텍스트");
    expect(repository.items).toHaveLength(1);
    expect(repository.items[0].id).toBe(result.id);
  });

  it("빈 텍스트는 에러를 발생시킨다", async () => {
    await expect(
      useCase.execute({
        text: "",
        sourceUrl: "https://example.com",
        sourceTitle: "예시",
      }),
    ).rejects.toThrow("텍스트는 비어있을 수 없습니다");
  });
});

describe("GetAllScrapsUseCase", () => {
  it("모든 스크랩을 반환한다", async () => {
    const repository = new MockScrapRepository();
    const saveUseCase = new SaveScrapUseCase(repository);
    const getAllUseCase = new GetAllScrapsUseCase(repository);

    await saveUseCase.execute({
      text: "첫 번째",
      sourceUrl: "https://a.com",
      sourceTitle: "A",
    });
    await saveUseCase.execute({
      text: "두 번째",
      sourceUrl: "https://b.com",
      sourceTitle: "B",
    });

    const result = await getAllUseCase.execute();
    expect(result).toHaveLength(2);
  });
});

describe("DeleteScrapUseCase", () => {
  it("id로 스크랩을 삭제한다", async () => {
    const repository = new MockScrapRepository();
    const saveUseCase = new SaveScrapUseCase(repository);
    const deleteUseCase = new DeleteScrapUseCase(repository);

    const saved = await saveUseCase.execute({
      text: "삭제할 항목",
      sourceUrl: "https://example.com",
      sourceTitle: "예시",
    });

    await deleteUseCase.execute(saved.id);
    expect(repository.items).toHaveLength(0);
  });
});

describe("SearchScrapsUseCase", () => {
  it("텍스트 검색 결과를 반환한다", async () => {
    const repository = new MockScrapRepository();
    const saveUseCase = new SaveScrapUseCase(repository);
    const searchUseCase = new SearchScrapsUseCase(repository);

    await saveUseCase.execute({
      text: "리액트 컴포넌트",
      sourceUrl: "https://a.com",
      sourceTitle: "A",
    });
    await saveUseCase.execute({
      text: "타입스크립트 설정",
      sourceUrl: "https://b.com",
      sourceTitle: "B",
    });

    const result = await searchUseCase.execute("리액트");
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("리액트 컴포넌트");
  });

  it("대소문자 구분 없이 검색한다", async () => {
    const repository = new MockScrapRepository();
    const saveUseCase = new SaveScrapUseCase(repository);
    const searchUseCase = new SearchScrapsUseCase(repository);

    await saveUseCase.execute({
      text: "Hello World",
      sourceUrl: "https://a.com",
      sourceTitle: "A",
    });

    const result = await searchUseCase.execute("hello");
    expect(result).toHaveLength(1);
  });
});
