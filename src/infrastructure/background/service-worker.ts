import { ChromeStorageScrapRepository } from "@/infrastructure/storage/ChromeStorageScrapRepository";
import { ChromeStorageSettingsRepository } from "@/infrastructure/storage/ChromeStorageSettingsRepository";
import { createMessageHandler } from "./messageHandler";
import type { AppMessage } from "@/application/ports/messages";

const scrapRepository = new ChromeStorageScrapRepository();
const settingsRepository = new ChromeStorageSettingsRepository();
const handleMessage = createMessageHandler(scrapRepository, settingsRepository);

chrome.runtime.onMessage.addListener((message: AppMessage, _sender, sendResponse) => {
  handleMessage(message).then(sendResponse);
  return true;
});

// 키보드 단축키 핸들러
chrome.commands.onCommand.addListener((command) => {
  if (command === "fetch-selection") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId) {
        chrome.tabs.sendMessage(tabId, { type: "TRIGGER_FETCH" });
      }
    });
  }
});
