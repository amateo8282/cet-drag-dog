import type { ScrapRepository } from "@/application/ports/ScrapRepository";
import type { ScrapItem } from "@/domain/ScrapItem";

interface SerializedScrapItem {
  id: string;
  text: string;
  sourceUrl: string;
  sourceTitle: string;
  createdAt: string;
  tags: string[];
}

const STORAGE_KEY = "scraps";

function serialize(item: ScrapItem): SerializedScrapItem {
  return {
    id: item.id,
    text: item.text,
    sourceUrl: item.sourceUrl,
    sourceTitle: item.sourceTitle,
    createdAt: item.createdAt.toISOString(),
    tags: [...item.tags],
  };
}

function deserialize(data: SerializedScrapItem): ScrapItem {
  return {
    id: data.id,
    text: data.text,
    sourceUrl: data.sourceUrl,
    sourceTitle: data.sourceTitle,
    createdAt: new Date(data.createdAt),
    tags: data.tags,
  };
}

export class ChromeStorageScrapRepository implements ScrapRepository {
  private async getItems(): Promise<ScrapItem[]> {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const raw = (result[STORAGE_KEY] ?? []) as SerializedScrapItem[];
    return raw.map(deserialize);
  }

  private async setItems(items: ScrapItem[]): Promise<void> {
    await chrome.storage.local.set({
      [STORAGE_KEY]: items.map(serialize),
    });
  }

  async save(item: ScrapItem): Promise<void> {
    const items = await this.getItems();
    items.unshift(item);
    await this.setItems(items);
  }

  async getAll(): Promise<ScrapItem[]> {
    return this.getItems();
  }

  async delete(id: string): Promise<void> {
    const items = await this.getItems();
    await this.setItems(items.filter((item) => item.id !== id));
  }

  async search(query: string): Promise<ScrapItem[]> {
    const items = await this.getItems();
    const lower = query.toLowerCase();
    return items.filter(
      (item) =>
        item.text.toLowerCase().includes(lower) ||
        item.sourceTitle.toLowerCase().includes(lower),
    );
  }
}
