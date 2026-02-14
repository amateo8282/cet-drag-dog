// 리트리버 SVG (인라인)
const RETRIEVER_SVG = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="24" cy="30" rx="14" ry="10" fill="#D4A574"/>
  <circle cx="24" cy="16" r="10" fill="#C49A6C"/>
  <ellipse cx="15" cy="12" rx="5" ry="8" fill="#B8895C" transform="rotate(-15 15 12)"/>
  <ellipse cx="33" cy="12" rx="5" ry="8" fill="#B8895C" transform="rotate(15 33 12)"/>
  <circle cx="20" cy="15" r="1.8" fill="#333"/>
  <circle cx="28" cy="15" r="1.8" fill="#333"/>
  <ellipse cx="24" cy="19" rx="2" ry="1.5" fill="#333"/>
  <path d="M37 27 Q44 18 42 12" stroke="#D4A574" stroke-width="3" stroke-linecap="round" fill="none"/>
</svg>`;

// 텍스트를 물고 있는 리트리버
const RETRIEVER_WITH_TEXT_SVG = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="24" cy="30" rx="14" ry="10" fill="#D4A574"/>
  <circle cx="24" cy="16" r="10" fill="#C49A6C"/>
  <ellipse cx="15" cy="12" rx="5" ry="8" fill="#B8895C" transform="rotate(-15 15 12)"/>
  <ellipse cx="33" cy="12" rx="5" ry="8" fill="#B8895C" transform="rotate(15 33 12)"/>
  <circle cx="20" cy="15" r="1.8" fill="#333"/>
  <circle cx="28" cy="15" r="1.8" fill="#333"/>
  <ellipse cx="24" cy="19" rx="2" ry="1.5" fill="#333"/>
  <rect x="16" y="21" width="16" height="6" rx="2" fill="#FEF3C7" stroke="#D97706" stroke-width="0.5"/>
  <line x1="18" y1="23" x2="30" y2="23" stroke="#92400E" stroke-width="0.8"/>
  <line x1="18" y1="25" x2="26" y2="25" stroke="#92400E" stroke-width="0.8"/>
  <path d="M37 27 Q44 18 42 12" stroke="#D4A574" stroke-width="3" stroke-linecap="round" fill="none">
    <animateTransform attributeName="transform" type="rotate" values="0 37 27;15 37 27;0 37 27" dur="0.3s" repeatCount="indefinite"/>
  </path>
</svg>`;

const CONTAINER_STYLES = `
  position: fixed;
  z-index: 2147483646;
  pointer-events: none;
  transition: none;
`;

export interface AnimationTarget {
  x: number;
  y: number;
}

export function createRetrieverAnimation(shadowRoot: ShadowRoot) {
  const container = document.createElement("div");
  container.setAttribute("style", CONTAINER_STYLES);
  container.innerHTML = RETRIEVER_SVG;
  container.style.display = "none";
  shadowRoot.appendChild(container);

  async function play(target: AnimationTarget): Promise<void> {
    return new Promise((resolve) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 시작점: 우하단
      const startX = viewportWidth - 60;
      const startY = viewportHeight - 60;

      container.innerHTML = RETRIEVER_SVG;
      container.style.display = "block";
      container.style.left = `${startX}px`;
      container.style.top = `${startY}px`;
      container.style.opacity = "0";
      container.style.transform = "scale(0.5)";
      container.style.transition = "none";

      // 등장 (0s -> 0.3s)
      requestAnimationFrame(() => {
        container.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        container.style.opacity = "1";
        container.style.transform = "scale(1)";
      });

      // 타겟으로 달려감 (0.3s -> 1.1s)
      setTimeout(() => {
        container.style.transition = "left 0.8s ease-in-out, top 0.8s ease-in-out";
        container.style.left = `${target.x - 24}px`;
        container.style.top = `${target.y - 24}px`;
      }, 300);

      // 물기 - SVG 교체 (1.1s -> 1.5s)
      setTimeout(() => {
        container.innerHTML = RETRIEVER_WITH_TEXT_SVG;
      }, 1100);

      // 복귀 (1.5s -> 2.3s)
      setTimeout(() => {
        container.style.transition = "left 0.8s ease-in-out, top 0.8s ease-in-out";
        container.style.left = `${startX}px`;
        container.style.top = `${startY}px`;
      }, 1500);

      // 퇴장 (2.3s -> 2.6s)
      setTimeout(() => {
        container.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        container.style.opacity = "0";
        container.style.transform = "scale(0.5)";
      }, 2300);

      // 완료
      setTimeout(() => {
        container.style.display = "none";
        container.innerHTML = RETRIEVER_SVG;
        resolve();
      }, 2600);
    });
  }

  return { play };
}
