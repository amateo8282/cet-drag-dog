import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useScraps } from "./useScraps";
import { MessageType } from "@/application/ports/messages";

const sendMessageMock = vi.fn();

vi.stubGlobal("chrome", {
  runtime: {
    sendMessage: sendMessageMock,
  },
});

describe("useScraps", () => {
  beforeEach(() => {
    sendMessageMock.mockReset();
  });

  it("마운트 시 스크랩 목록을 불러온다", async () => {
    const mockScraps = [
      { id: "1", text: "테스트", sourceUrl: "https://a.com", sourceTitle: "A", createdAt: new Date().toISOString(), tags: [] },
    ];

    sendMessageMock.mockImplementation((_msg, callback) => {
      callback({ success: true, data: mockScraps });
    });

    const { result } = renderHook(() => useScraps());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.scraps).toEqual(mockScraps);
    expect(sendMessageMock).toHaveBeenCalledWith(
      { type: MessageType.GET_ALL_SCRAPS },
      expect.any(Function),
    );
  });

  it("deleteScrap은 삭제 후 목록을 갱신한다", async () => {
    sendMessageMock.mockImplementation((_msg, callback) => {
      callback({ success: true, data: [] });
    });

    const { result } = renderHook(() => useScraps());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.deleteScrap("1");
    });

    expect(sendMessageMock).toHaveBeenCalledWith(
      { type: MessageType.DELETE_SCRAP, payload: { id: "1" } },
      expect.any(Function),
    );
  });

  it("searchScraps는 검색 메시지를 보낸다", async () => {
    sendMessageMock.mockImplementation((_msg, callback) => {
      callback({ success: true, data: [] });
    });

    const { result } = renderHook(() => useScraps());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.searchScraps("리액트");
    });

    expect(sendMessageMock).toHaveBeenCalledWith(
      { type: MessageType.SEARCH_SCRAPS, payload: { query: "리액트" } },
      expect.any(Function),
    );
  });

  it("빈 검색어로 searchScraps 호출하면 전체 목록을 가져온다", async () => {
    sendMessageMock.mockImplementation((_msg, callback) => {
      callback({ success: true, data: [] });
    });

    const { result } = renderHook(() => useScraps());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.searchScraps("");
    });

    const calls = sendMessageMock.mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall[0].type).toBe(MessageType.GET_ALL_SCRAPS);
  });
});
