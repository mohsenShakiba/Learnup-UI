import { Overlayer } from 'foliate-js/overlayer.js';

// foliate's per-section SVG overlay; draws highlights over the page without
// inserting nodes into the section DOM, so reading-position CFIs stay valid.
// (A wrapping <span> would shift node indices/offsets and invalidate them.)
export type SectionOverlayer = {
  add: (key: string, range: Range, draw: typeof Overlayer.highlight, options?: Record<string, unknown>) => void;
  remove: (key: string) => void;
};

// tracks the overlay and the keys we drew into it, so they can be cleared.
export type HighlightRef = { current: { overlayer: SectionOverlayer; keys: string[]; } | null; };

const WORD_HIGHLIGHT = 'rgba(255, 209, 0, 0.9)';
const SENTENCE_HIGHLIGHT = 'rgba(255, 209, 0, 0.35)';

const WORD_HIGHLIGHT_NAME = 'learnup-word';
const SENTENCE_HIGHLIGHT_NAME = 'learnup-sentence';

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
  overlayer: SectionOverlayer | null,
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

  highlightSelection(doc, block, range, bounds, overlayer, highlightRef);
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

// Highlights the word and surrounding sentence by drawing into foliate's SVG
// overlay, which paints over the live Ranges without inserting any nodes. This
// keeps the section DOM untouched so foliate's reading-position CFIs stay valid
// (a wrapping <span> would shift node indices/offsets and invalidate them), and
// unlike the CSS Custom Highlight API it renders reliably on mobile engines.
function highlightSelection (
  doc: Document,
  block: HTMLElement,
  wordRange: Range,
  bounds: { start: number; end: number; },
  overlayer: SectionOverlayer | null,
  highlightRef: HighlightRef,
) {
  clearHighlight(highlightRef);
  if (!overlayer) return;

  const keys: string[] = [];

  // draw the sentence first so the darker word highlight paints on top of it.
  const sentenceRange = rangeFromBlockOffsets(doc, block, bounds.start, bounds.end);
  if (sentenceRange) {
    overlayer.add(SENTENCE_HIGHLIGHT_NAME, sentenceRange, Overlayer.highlight, { color: SENTENCE_HIGHLIGHT });
    keys.push(SENTENCE_HIGHLIGHT_NAME);
  }

  overlayer.add(WORD_HIGHLIGHT_NAME, wordRange, Overlayer.highlight, { color: WORD_HIGHLIGHT });
  keys.push(WORD_HIGHLIGHT_NAME);

  highlightRef.current = { overlayer, keys };
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

function clearHighlight (highlightRef: HighlightRef) {
  const state = highlightRef.current;
  highlightRef.current = null;
  if (!state) return;

  for (const key of state.keys) state.overlayer.remove(key);
}
