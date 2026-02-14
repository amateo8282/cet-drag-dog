export interface TextSelectionResult {
  text: string;
  rect: DOMRect;
}

export function getTextSelection(): TextSelectionResult | null {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return null;

  const text = selection.toString().trim();
  if (!text) return null;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  return { text, rect };
}
