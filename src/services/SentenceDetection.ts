export type HighlightRef = { current: HTMLElement[] | null; };

const WORD_HIGHLIGHT = 'rgba(255, 209, 0, 0.45)';
const SENTENCE_HIGHLIGHT = 'rgba(255, 209, 0, 0.12)';

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
  const blockText = block.textContent ?? '';
  const wordOffset = offsetWithinBlock(doc, block, range.startContainer, range.startOffset);
  const bounds = sentenceBounds(blockText, wordOffset);
  const sentence = blockText.slice(bounds.start, bounds.end).trim();

  highlightSelection(doc, block, range, bounds, highlightRef);
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

function sentenceBounds (text: string, index: number): { start: number; end: number; } {
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

  // drop leading whitespace so the highlight starts at the first visible glyph.
  while (start < end && /\s/.test(text[start])) start++;

  return { start, end };
}

function highlightSelection (
  doc: Document,
  block: HTMLElement,
  wordRange: Range,
  bounds: { start: number; end: number; },
  highlightRef: HighlightRef,
) {
  clearHighlight(highlightRef);

  const spans: HTMLElement[] = [];

  // wrap the word first while its range is still valid, then the sentence so
  // the (darker) word highlight sits on top of the (very light) sentence one.
  const wordSpan = wrapRange(wordRange, WORD_HIGHLIGHT);
  if (wordSpan) spans.push(wordSpan);

  const sentenceRange = rangeFromBlockOffsets(doc, block, bounds.start, bounds.end);
  if (sentenceRange) {
    const sentenceSpan = wrapRange(sentenceRange, SENTENCE_HIGHLIGHT);
    if (sentenceSpan) spans.push(sentenceSpan);
  }

  highlightRef.current = spans.length ? spans : null;
}

// builds a Range covering [start, end) character offsets within the block's
// text content, walking across any inline markup and split text nodes.
function rangeFromBlockOffsets (
  doc: Document,
  block: Node,
  start: number,
  end: number,
): Range | null {
  const walker = doc.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  let total = 0;
  let startNode: Node | null = null;
  let startOffset = 0;
  let endNode: Node | null = null;
  let endOffset = 0;

  let node = walker.nextNode();
  while (node) {
    const len = (node.textContent ?? '').length;
    if (!startNode && start <= total + len) {
      startNode = node;
      startOffset = start - total;
    }
    if (end <= total + len) {
      endNode = node;
      endOffset = end - total;
      break;
    }
    total += len;
    node = walker.nextNode();
  }

  if (!startNode || !endNode) return null;

  const range = doc.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  return range;
}

function wrapRange (range: Range, color: string): HTMLElement | null {
  const doc = range.startContainer.ownerDocument;
  if (!doc) return null;

  const span = doc.createElement('span');
  span.style.backgroundColor = color;
  span.style.borderRadius = '3px';

  try {
    range.surroundContents(span);
    return span;
  } catch {
    // surroundContents throws if the range crosses element boundaries; skip it.
    return null;
  }
}

function clearHighlight (highlightRef: HighlightRef) {
  const spans = highlightRef.current;
  highlightRef.current = null;
  if (!spans) return;

  // unwrap inner-most spans first so the word highlight is removed before the
  // sentence highlight that contains it.
  for (const span of spans) {
    const parent = span.parentNode;
    if (!parent) continue;
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    parent.removeChild(span);
    parent.normalize();
  }
}
