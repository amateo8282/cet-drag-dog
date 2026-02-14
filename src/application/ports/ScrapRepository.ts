import type { ScrapItem } from "@/domain/ScrapItem";

export interface ScrapRepository {
  save(item: ScrapItem): Promise<void>;
  getAll(): Promise<ScrapItem[]>;
  delete(id: string): Promise<void>;
  search(query: string): Promise<ScrapItem[]>;
}
