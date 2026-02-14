import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScrapCard } from "./ScrapCard";

vi.stubGlobal("chrome", {
  tabs: { create: vi.fn() },
});

const mockScrap = {
  id: "test-1",
  text: "테스트 스크랩 텍스트",
  sourceUrl: "https://example.com",
  sourceTitle: "예시 페이지",
  createdAt: new Date("2026-02-14T10:00:00"),
  tags: [] as string[],
};

describe("ScrapCard", () => {
  it("스크랩 텍스트를 표시한다", () => {
    render(<ScrapCard scrap={mockScrap} onDelete={vi.fn()} />);
    expect(screen.getByText("테스트 스크랩 텍스트")).toBeInTheDocument();
  });

  it("출처 제목을 표시한다", () => {
    render(<ScrapCard scrap={mockScrap} onDelete={vi.fn()} />);
    expect(screen.getByText("예시 페이지")).toBeInTheDocument();
  });

  it("삭제 버튼 클릭 시 onDelete가 호출된다", () => {
    const onDelete = vi.fn();
    render(<ScrapCard scrap={mockScrap} onDelete={onDelete} />);
    fireEvent.click(screen.getByText("삭제"));
    expect(onDelete).toHaveBeenCalledWith("test-1");
  });

  it("복사 버튼이 존재한다", () => {
    render(<ScrapCard scrap={mockScrap} onDelete={vi.fn()} />);
    expect(screen.getByText("복사")).toBeInTheDocument();
  });
});
