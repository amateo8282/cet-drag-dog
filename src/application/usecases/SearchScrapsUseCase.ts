import type { ScrapRepository } from "@/application/ports/ScrapRepository";

export class SearchScrapsUseCase {
  constructor(private readonly repository: ScrapRepository) {}

  async execute(query: string) {
    return this.repository.search(query);
  }
}
