import type { ScrapRepository } from "@/application/ports/ScrapRepository";

export class DeleteScrapUseCase {
  constructor(private readonly repository: ScrapRepository) {}

  async execute(id: string) {
    await this.repository.delete(id);
  }
}
