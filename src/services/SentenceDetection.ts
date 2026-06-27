export type HighlightRef = { current: HTMLElement | null; };

export type SentenceDetectionResult = {
  word: string;
  sentence: string;
};

const WORD_CHAR = /[\p{L}\p{N}'’-]/u;
const SENTENCE_END = /[.!?؟۔]/;

export function detectSentenceAtPoint (
  doc: Document,
  x: number,
  y: number,
  highlightRef: HighlightRef,
): SentenceDetectionResult | null {
  const range = wordRangeAtPoint(doc, x, y);
  if (!range) return null;

  const word = range.toString().trim();
  const block = blockAncestor(range.startContainer);
  const sentence = sentenceAround(
    block.textContent ?? '',
    offsetWithinBlock(doc, block, range.startContainer, range.startOffset),
  );

  highlightRange(range, highlightRef);
  return { word, sentence };
}

function wordRangeAtPoint (doc: Document, x: number, y: number): Range | null {
  const caret = caretRangeAtPoint(doc, x, y);
  if (!caret) return null;

  const node = caret.startContainer;
  if (node.nodeType !== Node.TEXT_NODE) return null;

  const text = node.textContent ?? '';
  const [start, end] = wordBounds(text, caret.startOffset);
  if (start === end) return null;

  const range = doc.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  return range;
}

function caretRangeAtPoint (doc: Document, x: number, y: number): Range | null {
  const anyDoc = doc as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number; } | null;
  };

  if (anyDoc.caretRangeFromPoint) return anyDoc.caretRangeFromPoint(x, y);

  const position = anyDoc.caretPositionFromPoint?.(x, y);
  if (!position) return null;

  const range = doc.createRange();
  range.setStart(position.offsetNode, position.offset);
  return range;
}

function wordBounds (text: string, offset: number): [number, number] {
  let start = offset;
  let end = offset;

  while (start > 0 && WORD_CHAR.test(text[start - 1])) start--;
  while (end < text.length && WORD_CHAR.test(text[end])) end++;

  return [start, end];
}

function blockAncestor (node: Node): HTMLElement {
  const blocks = 'P, LI, BLOCKQUOTE, TD, DD, H1, H2, H3, H4, H5, H6';
  let el = node.parentElement;

  while (el && !el.matches(blocks) && el.parentElement) {
    el = el.parentElement;
  }

  return el ?? (node.parentElement as HTMLElement);
}

function offsetWithinBlock (doc: Document, block: Node, node: Node, nodeOffset: number): number {
  const walker = doc.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  let total = 0;
  let current = walker.nextNode();

  while (current) {
    if (current === node) return total + nodeOffset;
    total += (current.textContent ?? '').length;
    current = walker.nextNode();
  }

  return total;
}

function sentenceAround (text: string, index: number): string {
  let start = 0;
  for (let i = index - 1; i >= 0; i--) {
    if (SENTENCE_END.test(text[i])) {
      start = i + 1;
      break;
    }
  }

  let end = text.length;
  for (let i = index; i < text.length; i++) {
    if (SENTENCE_END.test(text[i])) {
      end = i + 1;
      break;
    }
  }

  return text.slice(start, end).trim();
}

function highlightRange (range: Range, highlightRef: HighlightRef) {
  clearHighlight(highlightRef);

  const doc = range.startContainer.ownerDocument;
  if (!doc) return;

  const span = doc.createElement('span');
  span.style.backgroundColor = 'rgba(255, 209, 0, 0.45)';
  span.style.borderRadius = '3px';

  try {
    range.surroundContents(span);
    highlightRef.current = span;
  } catch {
    // surroundContents throws if the range crosses element boundaries; skip the highlight.
  }
}

function clearHighlight (highlightRef: HighlightRef) {
  const span = highlightRef.current;
  highlightRef.current = null;

  const parent = span?.parentNode;
  if (!span || !parent) return;

  while (span.firstChild) parent.insertBefore(span.firstChild, span);
  parent.removeChild(span);
  parent.normalize();
}
