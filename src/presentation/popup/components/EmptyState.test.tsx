import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("빈 상태 메시지를 표시한다", () => {
    render(<EmptyState />);
    expect(screen.getByText("아직 물어온 텍스트가 없어요!")).toBeInTheDocument();
  });

  it("사용 안내 텍스트를 표시한다", () => {
    render(<EmptyState />);
    expect(screen.getByText(/Fetch! 버튼을 눌러보세요/)).toBeInTheDocument();
  });
});
