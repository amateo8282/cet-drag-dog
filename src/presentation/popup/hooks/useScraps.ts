import { useState, useEffect, useCallback } from "react";
import { MessageType } from "@/application/ports/messages";
import type { ScrapItem } from "@/domain/ScrapItem";

export function useScraps() {
  const [scraps, setScraps] = useState<ScrapItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScraps = useCallback(() => {
    setLoading(true);
    chrome.runtime.sendMessage(
      { type: MessageType.GET_ALL_SCRAPS },
      (response) => {
        if (response?.success) {
          setScraps(response.data);
        }
        setLoading(false);
      },
    );
  }, []);

  const deleteScrap = useCallback(
    (id: string) => {
      chrome.runtime.sendMessage(
        { type: MessageType.DELETE_SCRAP, payload: { id } },
        (response) => {
          if (response?.success) {
            fetchScraps();
          }
        },
      );
    },
    [fetchScraps],
  );

  const searchScraps = useCallback((query: string) => {
    if (!query.trim()) {
      chrome.runtime.sendMessage(
        { type: MessageType.GET_ALL_SCRAPS },
        (response) => {
          if (response?.success) {
            setScraps(response.data);
          }
        },
      );
      return;
    }
    chrome.runtime.sendMessage(
      { type: MessageType.SEARCH_SCRAPS, payload: { query } },
      (response) => {
        if (response?.success) {
          setScraps(response.data);
        }
      },
    );
  }, []);

  useEffect(() => {
    fetchScraps();
  }, [fetchScraps]);

  return { scraps, loading, deleteScrap, searchScraps, refetch: fetchScraps };
}
