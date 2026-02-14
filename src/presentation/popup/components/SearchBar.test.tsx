import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("입력 필드를 렌더링한다", () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText("스크랩 검색...")).toBeInTheDocument();
  });

  it("300ms debounce 후 onSearch가 호출된다", async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    fireEvent.change(screen.getByPlaceholderText("스크랩 검색..."), {
      target: { value: "테스트" },
    });

    // debounce 전
    expect(onSearch).not.toHaveBeenCalledWith("테스트");

    // debounce 후
    await waitFor(
      () => {
        expect(onSearch).toHaveBeenCalledWith("테스트");
      },
      { timeout: 500 },
    );
  });
});
