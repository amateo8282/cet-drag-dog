import type { ScrapRepository } from "@/application/ports/ScrapRepository";
import type { SettingsRepository } from "@/application/ports/SettingsRepository";
import {
  MessageType,
  type AppMessage,
  type MessageResponse,
} from "@/application/ports/messages";
import { SaveScrapUseCase } from "@/application/usecases/SaveScrapUseCase";
import { GetAllScrapsUseCase } from "@/application/usecases/GetAllScrapsUseCase";
import { DeleteScrapUseCase } from "@/application/usecases/DeleteScrapUseCase";
import { SearchScrapsUseCase } from "@/application/usecases/SearchScrapsUseCase";

export function createMessageHandler(
  scrapRepository: ScrapRepository,
  settingsRepository: SettingsRepository,
) {
  const saveScrap = new SaveScrapUseCase(scrapRepository);
  const getAllScraps = new GetAllScrapsUseCase(scrapRepository);
  const deleteScrap = new DeleteScrapUseCase(scrapRepository);
  const searchScraps = new SearchScrapsUseCase(scrapRepository);

  return async (message: AppMessage): Promise<MessageResponse> => {
    try {
      switch (message.type) {
        case MessageType.SAVE_SCRAP: {
          const item = await saveScrap.execute(message.payload);
          return { success: true, data: item };
        }
        case MessageType.GET_ALL_SCRAPS: {
          const items = await getAllScraps.execute();
          return { success: true, data: items };
        }
        case MessageType.DELETE_SCRAP: {
          await deleteScrap.execute(message.payload.id);
          return { success: true, data: undefined };
        }
        case MessageType.SEARCH_SCRAPS: {
          const items = await searchScraps.execute(message.payload.query);
          return { success: true, data: items };
        }
        case MessageType.GET_SETTINGS: {
          const settings = await settingsRepository.get();
          return { success: true, data: settings };
        }
        case MessageType.SAVE_SETTINGS: {
          await settingsRepository.save(message.payload);
          return { success: true, data: undefined };
        }
        default:
          return { success: false, error: "알 수 없는 메시지 타입" };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      };
    }
  };
}
