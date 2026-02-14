const BUTTON_ID = "fetch-boy-button";

const BUTTON_STYLES = `
  position: fixed;
  z-index: 2147483647;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: #f59e0b;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: transform 0.15s ease, opacity 0.15s ease;
  opacity: 0;
  transform: scale(0.8);
  pointer-events: none;
`;

export function createFetchButton(
  shadowRoot: ShadowRoot,
  onClick: () => void,
): {
  show: (x: number, y: number) => void;
  hide: () => void;
} {
  const button = document.createElement("button");
  button.id = BUTTON_ID;
  button.textContent = "Fetch!";
  button.setAttribute("style", BUTTON_STYLES);
  shadowRoot.appendChild(button);

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    onClick();
    hide();
  });

  function show(x: number, y: number) {
    button.style.left = `${x}px`;
    button.style.top = `${y + 8}px`;
    button.style.opacity = "1";
    button.style.transform = "scale(1)";
    button.style.pointerEvents = "auto";
  }

  function hide() {
    button.style.opacity = "0";
    button.style.transform = "scale(0.8)";
    button.style.pointerEvents = "none";
  }

  return { show, hide };
}
