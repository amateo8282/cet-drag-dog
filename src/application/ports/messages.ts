import type { CreateScrapItemInput, ScrapItem } from "@/domain/ScrapItem";
import type { Settings } from "@/domain/Settings";

export const MessageType = {
  SAVE_SCRAP: "SAVE_SCRAP",
  GET_ALL_SCRAPS: "GET_ALL_SCRAPS",
  DELETE_SCRAP: "DELETE_SCRAP",
  SEARCH_SCRAPS: "SEARCH_SCRAPS",
  GET_SETTINGS: "GET_SETTINGS",
  SAVE_SETTINGS: "SAVE_SETTINGS",
} as const;

export type SaveScrapMessage = {
  type: typeof MessageType.SAVE_SCRAP;
  payload: CreateScrapItemInput;
};

export type GetAllScrapsMessage = {
  type: typeof MessageType.GET_ALL_SCRAPS;
};

export type DeleteScrapMessage = {
  type: typeof MessageType.DELETE_SCRAP;
  payload: { id: string };
};

export type SearchScrapsMessage = {
  type: typeof MessageType.SEARCH_SCRAPS;
  payload: { query: string };
};

export type GetSettingsMessage = {
  type: typeof MessageType.GET_SETTINGS;
};

export type SaveSettingsMessage = {
  type: typeof MessageType.SAVE_SETTINGS;
  payload: Settings;
};

export type AppMessage =
  | SaveScrapMessage
  | GetAllScrapsMessage
  | DeleteScrapMessage
  | SearchScrapsMessage
  | GetSettingsMessage
  | SaveSettingsMessage;

export type MessageResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

export type SaveScrapResponse = MessageResponse<ScrapItem>;
export type GetAllScrapsResponse = MessageResponse<ScrapItem[]>;
export type DeleteScrapResponse = MessageResponse<void>;
export type SearchScrapsResponse = MessageResponse<ScrapItem[]>;
