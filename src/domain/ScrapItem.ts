export interface ScrapItem {
  readonly id: string;
  readonly text: string;
  readonly sourceUrl: string;
  readonly sourceTitle: string;
  readonly createdAt: Date;
  readonly tags: readonly string[];
}

export interface CreateScrapItemInput {
  text: string;
  sourceUrl: string;
  sourceTitle: string;
  tags?: string[];
}

export function createScrapItem(input: CreateScrapItemInput): ScrapItem {
  const trimmed = input.text.trim();
  if (!trimmed) {
    throw new Error("텍스트는 비어있을 수 없습니다");
  }

  return {
    id: crypto.randomUUID(),
    text: trimmed,
    sourceUrl: input.sourceUrl,
    sourceTitle: input.sourceTitle,
    createdAt: new Date(),
    tags: input.tags ?? [],
  };
}
