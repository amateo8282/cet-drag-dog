const TOAST_STYLES = `
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2147483647;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #292524;
  color: #fafaf9;
  border-radius: 12px;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transform: translateX(120%);
  transition: transform 0.3s ease;
`;

export function createToast(shadowRoot: ShadowRoot) {
  const toast = document.createElement("div");
  toast.setAttribute("style", TOAST_STYLES);
  shadowRoot.appendChild(toast);

  function show(message: string = "멍! 물어왔어요!") {
    toast.textContent = message;
    toast.style.transform = "translateX(0)";

    setTimeout(() => {
      toast.style.transform = "translateX(120%)";
    }, 2000);
  }

  return { show };
}
