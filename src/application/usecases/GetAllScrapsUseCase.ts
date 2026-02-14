import type { ScrapRepository } from "@/application/ports/ScrapRepository";

export class GetAllScrapsUseCase {
  constructor(private readonly repository: ScrapRepository) {}

  async execute() {
    return this.repository.getAll();
  }
}
