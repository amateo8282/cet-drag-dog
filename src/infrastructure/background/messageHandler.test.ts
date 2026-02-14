import { describe, it, expect, beforeEach } from "vitest";
import { createMessageHandler } from "./messageHandler";
import { MessageType } from "@/application/ports/messages";
import type { ScrapRepository } from "@/application/ports/ScrapRepository";
import type { SettingsRepository } from "@/application/ports/SettingsRepository";
import type { ScrapItem } from "@/domain/ScrapItem";
import type { Settings } from "@/domain/Settings";
import { DEFAULT_SETTINGS } from "@/domain/Settings";

class InMemoryScrapRepository implements ScrapRepository {
  items: ScrapItem[] = [];

  async save(item: ScrapItem) {
    this.items.push(item);
  }
  async getAll() {
    return [...this.items];
  }
  async delete(id: string) {
    this.items = this.items.filter((i) => i.id !== id);
  }
  async search(query: string) {
    return this.items.filter((i) =>
      i.text.toLowerCase().includes(query.toLowerCase()),
    );
  }
}

class InMemorySettingsRepository implements SettingsRepository {
  settings: Settings = { ...DEFAULT_SETTINGS };

  async get() {
    return { ...this.settings };
  }
  async save(settings: Settings) {
    this.settings = { ...settings };
  }
}

describe("messageHandler", () => {
  let scrapRepo: InMemoryScrapRepository;
  let settingsRepo: InMemorySettingsRepository;
  let handler: ReturnType<typeof createMessageHandler>;

  beforeEach(() => {
    scrapRepo = new InMemoryScrapRepository();
    settingsRepo = new InMemorySettingsRepository();
    handler = createMessageHandler(scrapRepo, settingsRepo);
  });

  it("SAVE_SCRAP: 스크랩을 저장한다", async () => {
    const result = await handler({
      type: MessageType.SAVE_SCRAP,
      payload: {
        text: "테스트",
        sourceUrl: "https://example.com",
        sourceTitle: "예시",
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveProperty("id");
      expect((result.data as ScrapItem).text).toBe("테스트");
    }
    expect(scrapRepo.items).toHaveLength(1);
  });

  it("GET_ALL_SCRAPS: 모든 스크랩을 반환한다", async () => {
    await handler({
      type: MessageType.SAVE_SCRAP,
      payload: { text: "항목1", sourceUrl: "https://a.com", sourceTitle: "A" },
    });

    const result = await handler({ type: MessageType.GET_ALL_SCRAPS });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(1);
    }
  });

  it("DELETE_SCRAP: 스크랩을 삭제한다", async () => {
    const saveResult = await handler({
      type: MessageType.SAVE_SCRAP,
      payload: { text: "삭제 대상", sourceUrl: "https://a.com", sourceTitle: "A" },
    });

    if (saveResult.success) {
      const id = (saveResult.data as ScrapItem).id;
      const deleteResult = await handler({
        type: MessageType.DELETE_SCRAP,
        payload: { id },
      });
      expect(deleteResult.success).toBe(true);
      expect(scrapRepo.items).toHaveLength(0);
    }
  });

  it("SEARCH_SCRAPS: 검색 결과를 반환한다", async () => {
    await handler({
      type: MessageType.SAVE_SCRAP,
      payload: { text: "리액트 가이드", sourceUrl: "https://a.com", sourceTitle: "A" },
    });
    await handler({
      type: MessageType.SAVE_SCRAP,
      payload: { text: "타입스크립트", sourceUrl: "https://b.com", sourceTitle: "B" },
    });

    const result = await handler({
      type: MessageType.SEARCH_SCRAPS,
      payload: { query: "리액트" },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(1);
    }
  });

  it("빈 텍스트 저장 시 에러를 반환한다", async () => {
    const result = await handler({
      type: MessageType.SAVE_SCRAP,
      payload: { text: "", sourceUrl: "https://a.com", sourceTitle: "A" },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("텍스트는 비어있을 수 없습니다");
    }
  });

  it("GET_SETTINGS: 설정을 반환한다", async () => {
    const result = await handler({ type: MessageType.GET_SETTINGS });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(DEFAULT_SETTINGS);
    }
  });

  it("SAVE_SETTINGS: 설정을 저장한다", async () => {
    await handler({
      type: MessageType.SAVE_SETTINGS,
      payload: { animationEnabled: false, toastEnabled: true, soundEnabled: true },
    });

    const result = await handler({ type: MessageType.GET_SETTINGS });
    expect(result.success).toBe(true);
    if (result.success) {
      expect((result.data as Settings).animationEnabled).toBe(false);
    }
  });
});
