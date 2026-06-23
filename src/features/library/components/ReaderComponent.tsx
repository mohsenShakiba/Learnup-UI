import { Box, IconButton, Stack, Typography } from '@mui/material';
import Epub, { Rendition } from 'epubjs';
import { useEffect, useRef, useState } from 'react';
import { AiService, CancelError, UserBooksService } from '../../../api/Learnup';
import { calculateTotalPages, SectionLocation } from '../../../utils/Calculate';
import { DEFAULT_CONFIG, READER_FONT_FAMILY, ReaderConfig } from '../readerTypes';
import { AiResultDrawer } from './AiResultDrawer';
import { ReaderConfigDrawer } from './ReaderConfigDrawer';

interface Props {
  bookData: ArrayBuffer;
  bookId?: number;
  initialCfi?: string | null;
}

// Push the reader configuration into the epub rendition. Re-registering the
// named theme and re-selecting it makes epubjs re-inject the styles into every
// currently rendered section, so changes apply live without a reload.
function applyReaderStyles (rendition: Rendition, config: ReaderConfig) {
  rendition.themes.register('reader', {
    'body, p, li, span, div, h1, h2, h3, h4, h5, h6, a': {
      'font-family': `${READER_FONT_FAMILY} !important`,
      'font-size': `${config.fontSize}px !important`,
    },
    body: {
      // iOS Safari only fires click events on elements it considers "clickable";
      // cursor:pointer marks the content as such so taps reach our listener.
      'cursor': 'pointer',
      '-webkit-tap-highlight-color': 'transparent',
    },
  });
  rendition.themes.select('reader');
  rendition.themes.fontSize(`${config.fontSize}px`);
}

type HighlightRef = { current: HTMLElement | null; };

// Characters that count as part of a word (Unicode letters/numbers, plus
// intra-word marks). Used to grow a click point out to whole-word bounds.
const WORD_CHAR = /[\p{L}\p{N}'’\-]/u;
// Sentence terminators, including common Persian/Arabic punctuation.
const SENTENCE_END = /[.!?؟۔]/;

// Resolve the word under the given client coordinates to a DOM Range.
function wordRangeAtPoint (doc: Document, x: number, y: number): Range | null {
  const anyDoc = doc as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number; } | null;
  };

  let caret: Range | null = null;
  if (anyDoc.caretRangeFromPoint) {
    caret = anyDoc.caretRangeFromPoint(x, y);
  } else if (anyDoc.caretPositionFromPoint) {
    const pos = anyDoc.caretPositionFromPoint(x, y);
    if (pos) {
      caret = doc.createRange();
      caret.setStart(pos.offsetNode, pos.offset);
    }
  }
  if (!caret) return null;

  const node = caret.startContainer;
  if (node.nodeType !== Node.TEXT_NODE) return null;
  const text = node.textContent ?? '';

  let start = caret.startOffset;
  let end = caret.startOffset;
  while (start > 0 && WORD_CHAR.test(text[start - 1])) start--;
  while (end < text.length && WORD_CHAR.test(text[end])) end++;
  if (start === end) return null;

  const range = doc.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  return range;
}

// Nearest block-level ancestor that bounds a sentence.
function blockAncestor (node: Node): HTMLElement {
  const blocks = 'P, LI, BLOCKQUOTE, TD, DD, H1, H2, H3, H4, H5, H6';
  let el = node.parentElement;
  while (el && !el.matches(blocks) && el.parentElement) el = el.parentElement;
  return el ?? (node.parentElement as HTMLElement);
}

// Character offset of (node, nodeOffset) within block.textContent.
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

// Extract the sentence in text that contains the character at index.
function sentenceAround (text: string, index: number): string {
  let start = 0;
  for (let i = index - 1; i >= 0; i--) {
    if (SENTENCE_END.test(text[i])) { start = i + 1; break; }
  }
  let end = text.length;
  for (let i = index; i < text.length; i++) {
    if (SENTENCE_END.test(text[i])) { end = i + 1; break; }
  }
  return text.slice(start, end).trim();
}

// Unwrap the previously highlighted word, restoring the original text node.
function clearHighlight (highlightRef: HighlightRef) {
  const span = highlightRef.current;
  highlightRef.current = null;
  const parent = span?.parentNode;
  if (!span || !parent) return;
  while (span.firstChild) parent.insertBefore(span.firstChild, span);
  parent.removeChild(span);
  parent.normalize();
}

// Highlight the clicked word and return the sentence surrounding it.
function selectWordAt (doc: Document, x: number, y: number, highlightRef: HighlightRef): string | null {
  const range = wordRangeAtPoint(doc, x, y);
  if (!range) return null;

  // Compute the sentence before mutating the DOM, since highlighting splits nodes.
  const block = blockAncestor(range.startContainer);
  const blockText = block.textContent ?? '';
  const wordOffset = offsetWithinBlock(doc, block, range.startContainer, range.startOffset);
  const sentence = sentenceAround(blockText, wordOffset);

  clearHighlight(highlightRef);
  const span = doc.createElement('span');
  span.style.backgroundColor = 'rgba(255, 209, 0, 0.45)';
  span.style.borderRadius = '3px';
  try {
    range.surroundContents(span);
    highlightRef.current = span;
  } catch {
    // surroundContents throws if the range crosses element boundaries; skip the highlight.
  }
  return sentence;
}

declare global {
  interface Window {
    ePubViewer?: {
      Book: {
        nextPage: () => void;
        prevPage: () => void;
      };
    };
  }
}

export function ReaderComponent ({ bookData, bookId, initialCfi }: Props) {

  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string | null>(initialCfi ?? null);
  // Cumulative page count preceding each spine section, indexed by spine position.
  const sectionOffsetsRef = useRef<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [config, setConfig] = useState<ReaderConfig>(DEFAULT_CONFIG);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Latest config for the rendition-creation effect, so styling a freshly built
  // rendition does not force that effect to depend on (and recreate on) config.
  const configRef = useRef(config);
  configRef.current = config;
  // The currently highlighted word's wrapper span, so it can be removed on the next click.
  const highlightRef = useRef<HTMLElement | null>(null);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiSentence, setAiSentence] = useState('');
  // In-flight AI request, so a new selection cancels the previous one.
  const aiRequestRef = useRef<ReturnType<typeof AiService.postMobileAiSend> | null>(null);

  // Send the selected sentence to the AI service and surface the result in the drawer.
  const askAi = (sentence: string) => {
    aiRequestRef.current?.cancel();
    setAiSentence(sentence);
    setAiResult(null);
    setAiError(false);
    setAiLoading(true);
    setAiOpen(true);

    const request = AiService.postMobileAiSend(sentence);
    aiRequestRef.current = request;
    request
      .then((res) => {
        setAiResult(res);
        setAiLoading(false);
      })
      .catch((err) => {
        if (err instanceof CancelError) return;
        setAiError(true);
        setAiLoading(false);
      });
  };
  // Keep the latest handler reachable from the per-section click listener
  // without re-registering it whenever the component re-renders.
  const askAiRef = useRef(askAi);
  askAiRef.current = askAi;

  useEffect(() => {
    if (!viewerRef.current) return;

    const book = Epub(bookData);

    const rendition = book.renderTo(viewerRef.current, {
      flow: 'paginated',
      manager: 'continuous',
      width: '100%',
      height: '100%',
      // iOS Safari does not deliver touch/click events into a sandboxed iframe
      // unless allow-scripts is present; this adds it so taps reach our handlers.
      allowScriptedContent: true,
      snap: true
    });

    renditionRef.current = rendition;

    applyReaderStyles(rendition, configRef.current);

    // epubjs re-emits each section's DOM events on the rendition (see passEvents),
    // so we hook taps here instead of attaching per-section listeners. touchend is
    // used on touch devices because iOS Safari often withholds the synthetic click.
    const handleTap = (doc: Document, x: number, y: number) => {
      const sentence = selectWordAt(doc, x, y, highlightRef);
      if (sentence) askAiRef.current(sentence);
    };

    let lastTouchAt = 0;

    // rendition.on('touchend', (event: TouchEvent, contents: Contents) => {
    //   const touch = event.changedTouches[0];
    //   if (!touch) return;
    //   lastTouchAt = Date.now();
    //   handleTap(contents.document, touch.clientX, touch.clientY);
    // });
    // rendition.on('click', (event: MouseEvent, contents: Contents) => {
    //   // Ignore the synthetic click that follows a touchend we already handled.
    //   if (Date.now() - lastTouchAt < 700) return;
    //   handleTap(contents.document, event.clientX, event.clientY);
    // });

    window.ePubViewer = {
      Book: {
        nextPage: () => rendition.next(),
        prevPage: () => rendition.prev(),
      },
    };

    // Translate a section-relative location into a whole-book page number.
    const toGlobalPage = (start?: SectionLocation) => {
      if (!start) return null;
      const offset = sectionOffsetsRef.current[start.index] ?? 0;
      return offset + start.displayed.page;
    };



    // Persist the reading position whenever the page changes.
    rendition.on('relocated', (location: { start?: SectionLocation; }) => {
      const start = location?.start;
      const cfi = start?.cfi;
      if (!cfi) return;

      const page = toGlobalPage(start);
      if (page != null) setCurrentPage(page);

      if (bookId == null || cfi === lastSavedRef.current) return;
      lastSavedRef.current = cfi;

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        UserBooksService.updateUserBookCurrentPage(bookId, { currentRef: cfi });
      }, 800);
    });

    // Restore the saved page on load, falling back to the start of the book.
    rendition.display(initialCfi ?? undefined);

    // Pre-paginate every section in a hidden rendition sized like the viewer so
    // we know how many pages each contains. This yields a stable "page X / Y"
    // that advances by one per flip, instead of the character-based location
    // count which can skip several numbers per page.
    let cancelled = false;

    book.ready.then(async () => {
      if (cancelled || !viewerRef.current) return;
      const pageCalculation = await calculateTotalPages(book, viewerRef.current, () => cancelled);
      if (!pageCalculation) return;

      sectionOffsetsRef.current = pageCalculation.offsets;
      setTotalPages(pageCalculation.totalPages);

      // Reflect the page for the position the visible rendition already shows.
      const current = (renditionRef.current?.currentLocation() as unknown as { start?: SectionLocation; })?.start;
      const page = toGlobalPage(current);
      if (page != null) setCurrentPage(page);
    });

    return () => {
      cancelled = true;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      aiRequestRef.current?.cancel();
      rendition.destroy();
      book.destroy();
      renditionRef.current = null;
      delete window.ePubViewer;
    };

  }, [bookData, bookId, initialCfi]);

  // Re-apply styling whenever the config changes, without rebuilding the book.
  useEffect(() => {
    if (renditionRef.current) applyReaderStyles(renditionRef.current, config);
  }, [config]);

  const handleConfigChange = (patch: Partial<ReaderConfig>) =>
    setConfig((prev) => ({ ...prev, ...patch }));

  return (
    <Stack sx={{ width: '100%', height: '100%', overflow: 'hidden', }}>
      <Box ref={viewerRef} sx={{ flex: 1, minHeight: 0, width: '100%', fontSize: '30px' }} />
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <IconButton onClick={() => setSettingsOpen(true)}>
          <span className="material-icons">settings</span>
        </IconButton>
        <IconButton
          onClick={() => renditionRef.current?.next()}>
          <span className="material-icons">chevron_right</span>
        </IconButton>
        <Typography variant="body2" sx={{ alignSelf: 'center', color: 'text.secondary' }}>
          {currentPage != null && totalPages != null ? `${currentPage} / ${totalPages}` : '…'}
        </Typography>
        <IconButton
          onClick={() => renditionRef.current?.prev()}>
          <span className="material-icons">chevron_left</span>
        </IconButton>
      </Stack>

      <ReaderConfigDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        config={config}
        onConfigChange={handleConfigChange}
      />

      <AiResultDrawer
        open={aiOpen}
        onOpen={() => setAiOpen(true)}
        onClose={() => setAiOpen(false)}
        sentence={aiSentence}
        loading={aiLoading}
        error={aiError}
        result={aiResult}
      />
    </Stack>
  );
}
