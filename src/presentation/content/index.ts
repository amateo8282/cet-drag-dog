import { getTextSelection } from "@/application/services/textSelection";
import { MessageType } from "@/application/ports/messages";
import type { Settings } from "@/domain/Settings";
import { createFetchButton } from "./FetchButton";
import { createRetrieverAnimation } from "./RetrieverAnimation";
import { createToast } from "./Toast";

// Shadow DOM 호스트 생성
const host = document.createElement("div");
host.id = "fetch-boy-root";
document.body.appendChild(host);
const shadowRoot = host.attachShadow({ mode: "closed" });

const retrieverAnimation = createRetrieverAnimation(shadowRoot);
const toast = createToast(shadowRoot);

let lastSelection: { text: string; rect: DOMRect } | null = null;

function getSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { type: MessageType.GET_SETTINGS },
      (response) => {
        if (response?.success) {
          resolve(response.data);
        } else {
          resolve({ animationEnabled: true, toastEnabled: true });
        }
      },
    );
  });
}

const fetchButton = createFetchButton(shadowRoot, async () => {
  if (!lastSelection) return;

  const settings = await getSettings();
  const selectionRect = lastSelection.rect;

  // 애니메이션 재생 (설정에 따라)
  if (settings.animationEnabled) {
    retrieverAnimation.play({
      x: selectionRect.left + selectionRect.width / 2,
      y: selectionRect.top + selectionRect.height / 2,
    });
  }

  // 저장
  chrome.runtime.sendMessage(
    {
      type: MessageType.SAVE_SCRAP,
      payload: {
        text: lastSelection.text,
        sourceUrl: window.location.href,
        sourceTitle: document.title,
      },
    },
    (response) => {
      if (response?.success && settings.toastEnabled) {
        // 애니메이션 완료 후 토스트 (애니메이션이 꺼져있으면 즉시)
        const delay = settings.animationEnabled ? 2600 : 0;
        setTimeout(() => toast.show(), delay);
      }
    },
  );

  lastSelection = null;
});

document.addEventListener("mouseup", (e) => {
  if (host.contains(e.target as Node)) return;

  setTimeout(() => {
    const selection = getTextSelection();
    if (selection) {
      lastSelection = { text: selection.text, rect: selection.rect };
      fetchButton.show(
        selection.rect.left + selection.rect.width / 2 - 30,
        selection.rect.bottom,
      );
    } else {
      fetchButton.hide();
      lastSelection = null;
    }
  }, 10);
});

document.addEventListener("mousedown", (e) => {
  if (host.contains(e.target as Node)) return;
  fetchButton.hide();
});

// 키보드 단축키 메시지 수신
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "TRIGGER_FETCH") {
    const selection = getTextSelection();
    if (selection) {
      lastSelection = { text: selection.text, rect: selection.rect };
      // 버튼 클릭과 동일한 동작 트리거
      fetchButton.show(
        selection.rect.left + selection.rect.width / 2 - 30,
        selection.rect.bottom,
      );
    }
  }
});
