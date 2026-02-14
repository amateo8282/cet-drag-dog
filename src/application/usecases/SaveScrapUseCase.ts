import type { ScrapRepository } from "@/application/ports/ScrapRepository";
import { createScrapItem, type CreateScrapItemInput } from "@/domain/ScrapItem";

export class SaveScrapUseCase {
  constructor(private readonly repository: ScrapRepository) {}

  async execute(input: CreateScrapItemInput) {
    const item = createScrapItem(input);
    await this.repository.save(item);
    return item;
  }
}
