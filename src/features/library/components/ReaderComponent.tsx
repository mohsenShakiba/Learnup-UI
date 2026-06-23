import { Box, Stack } from '@mui/material';
import Epub, { Contents, Rendition } from 'epubjs';
import { useEffect, useRef, useState } from 'react';
import { AiService, BooksControllersService, CancelError, SendAiTextResponse } from '../../../api/Learnup';
import { SectionLocation } from '../../../utils/Calculate';
import { NavItem, preloadReaderFonts, READER_FONT_FACES, READER_THEMES, ReaderConfig } from '../readerTypes';
import { AiResultDrawer } from './AiResultDrawer';
import { ReaderConfigDrawer } from './ReaderConfigDrawer';
import { TableOfContentsDrawer } from './TableOfContentsDrawer';

interface Props {
  bookData: ArrayBuffer;
  bookId?: number;
  initialCfi?: string | null;
  settingsOpen: boolean;
  onSettingsClose: () => void;
  tocOpen: boolean;
  onTocClose: () => void;
  // Reports the title of the section currently on screen (null when unknown).
  onSectionChange: (title: string | null) => void;
  config: ReaderConfig;
  onConfigChange: (patch: Partial<ReaderConfig>) => void;
}

// epubjs navigation item shape (the subset we read).
interface EpubNavItem {
  id?: string;
  href: string;
  label: string;
  subitems?: EpubNavItem[];
}

// Convert epubjs' navigation tree into our own NavItem tree, trimming labels.
function toNavItems (items: EpubNavItem[]): NavItem[] {
  return items.map((it) => ({
    id: it.id ?? it.href,
    href: it.href,
    label: (it.label ?? '').trim(),
    subitems: it.subitems && it.subitems.length ? toNavItems(it.subitems) : undefined,
  }));
}

// Flatten the nav tree into a single list for href lookups.
function flattenNav (items: NavItem[]): NavItem[] {
  return items.flatMap((it) => [it, ...(it.subitems ? flattenNav(it.subitems) : [])]);
}

// Strip directory and fragment so a spine href can be matched to a TOC entry.
function hrefKey (href: string): string {
  return href.split('#')[0].split('/').pop() ?? href;
}

function readerCss (config: ReaderConfig): string {
  const theme = READER_THEMES.find((t) => t.key === config.theme) ?? READER_THEMES[0];

  return `
    body, p, li, span, div, h1, h2, h3, h4, h5, h6, a {
      font-family: ${config.fontFamily} !important;
      font-size: ${config.fontSize}px !important;
      line-height: ${config.lineHeight} !important;
      color: ${theme.color} !important;
    }
    p, li, div, h1, h2, h3, h4, h5, h6 {
      text-align: ${config.textAlign} !important;
      text-justify: ${config.textJustify} !important;
    }
    body {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
  `;
}

function applyReaderStylesToContents (contents: Contents, config: ReaderConfig) {
  const doc = contents.document;
  let style = doc.getElementById('learnup-reader-live-style') as HTMLStyleElement | null;
  if (!style) {
    style = doc.createElement('style');
    style.id = 'learnup-reader-live-style';
  }

  style.textContent = readerCss(config);
  doc.head.appendChild(style);
}

function getRenditionContents (rendition: Rendition): Contents[] {
  return (rendition.getContents() as unknown as Contents[]) ?? [];
}

function applyReaderStyles (rendition: Rendition, config: ReaderConfig, extraContents: Contents[] = []) {
  rendition.themes.registerCss('reader', readerCss(config));
  rendition.themes.select('reader');
  rendition.themes.fontSize(`${config.fontSize}px`);
  new Set([...getRenditionContents(rendition), ...extraContents]).forEach((contents) => {
    applyReaderStylesToContents(contents, config);
  });
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

// Highlight the clicked word and return it along with the sentence surrounding it.
function selectWordAt (doc: Document, x: number, y: number, highlightRef: HighlightRef): { word: string; sentence: string; } | null {
  const range = wordRangeAtPoint(doc, x, y);
  if (!range) return null;

  // Compute the word and sentence before mutating the DOM, since highlighting splits nodes.
  const word = range.toString().trim();
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
  return { word, sentence };
}

// Eased animation of an element's scrollLeft toward target, used to snap to the
// nearest page after a drag. Returns a canceller so a new gesture can interrupt it.
function animateScrollLeft (el: HTMLElement, target: number, duration = 200, onComplete?: () => void): () => void {
  const start = el.scrollLeft;
  const distance = target - start;
  if (distance === 0) {
    onComplete?.();
    return () => { };
  }

  const startTime = performance.now();
  let raf = 0;
  const step = (now: number) => {
    const t = Math.min(1, (now - startTime) / duration);
    // easeInOutQuad
    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    el.scrollLeft = start + distance * eased;
    if (t < 1) {
      raf = requestAnimationFrame(step);
    } else {
      onComplete?.();
    }
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

function nextFrame (): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function waitForContentFonts (contents: Contents) {
  const fonts = contents.document.fonts;
  if (!fonts) {
    await nextFrame();
    return;
  }

  try {
    await fonts.ready;
  } catch {
    // Keep the reader usable if a custom font fails and the browser falls back.
  }

  // Let the iframe paint once with the resolved font before epub.js samples layout.
  await nextFrame();
}

function rangeFromPoint (doc: Document, x: number, y: number): Range | null {
  const anyDoc = doc as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number; } | null;
  };

  if (anyDoc.caretRangeFromPoint) return anyDoc.caretRangeFromPoint(x, y);

  const pos = anyDoc.caretPositionFromPoint?.(x, y);
  if (!pos) return null;

  const range = doc.createRange();
  range.setStart(pos.offsetNode, pos.offset);
  range.collapse(true);
  return range;
}

function visiblePointCfi (rendition: Rendition): string | null {
  type VisibleView = {
    contents?: Contents;
    iframe?: HTMLIFrameElement;
  };
  type VisibleManager = {
    container?: HTMLElement;
    visible?: () => VisibleView[];
  };

  const manager = (rendition as unknown as { manager?: VisibleManager; }).manager;
  const container = manager?.container;
  const views = manager?.visible?.() ?? [];
  if (!container || !views.length) return null;

  const bounds = container.getBoundingClientRect();
  const points = [
    [bounds.left + bounds.width * 0.5, bounds.top + bounds.height * 0.45],
    [bounds.left + bounds.width * 0.5, bounds.top + bounds.height * 0.35],
    [bounds.left + bounds.width * 0.35, bounds.top + bounds.height * 0.45],
    [bounds.left + bounds.width * 0.65, bounds.top + bounds.height * 0.45],
  ];

  for (const [clientX, clientY] of points) {
    for (const view of views) {
      const iframe = view.iframe;
      const contents = view.contents;
      if (!iframe || !contents) continue;

      const iframeBounds = iframe.getBoundingClientRect();
      if (
        clientX < iframeBounds.left ||
        clientX > iframeBounds.right ||
        clientY < iframeBounds.top ||
        clientY > iframeBounds.bottom
      ) continue;

      const range = rangeFromPoint(contents.document, clientX - iframeBounds.left, clientY - iframeBounds.top);
      if (!range) continue;

      try {
        return contents.cfiFromRange(range);
      } catch {
        // Keep probing other points; some coordinates can land on non-content nodes.
      }
    }
  }

  return null;
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

export function ReaderComponent ({ bookData, bookId, initialCfi, settingsOpen, onSettingsClose, tocOpen, onTocClose, onSectionChange, config, onConfigChange }: Props) {

  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const contentsRef = useRef<Set<Contents>>(new Set());
  const [toc, setToc] = useState<NavItem[]>([]);
  // Flat TOC list for mapping a spine href to its section label.
  const flatTocRef = useRef<NavItem[]>([]);
  // Keep the latest section-change handler reachable from the rendition's
  // relocated listener without re-registering it on every render.
  const onSectionChangeRef = useRef(onSectionChange);
  onSectionChangeRef.current = onSectionChange;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string | null>(initialCfi ?? null);
  // Latest config for the rendition-creation effect, so styling a freshly built
  // rendition does not force that effect to depend on (and recreate on) config.
  const configRef = useRef(config);
  configRef.current = config;
  // The currently highlighted word's wrapper span, so it can be removed on the next click.
  const highlightRef = useRef<HTMLElement | null>(null);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [aiResult, setAiResult] = useState<SendAiTextResponse | null>(null);
  const [aiWord, setAiWord] = useState('');
  const [aiSentence, setAiSentence] = useState('');
  // In-flight AI request, so a new selection cancels the previous one.
  const aiRequestRef = useRef<ReturnType<typeof AiService.postMobileAiSend> | null>(null);

  // Send the selected word and sentence to the AI service and surface the result in the drawer.
  const askAi = (word: string, sentence: string) => {
    const selectedWord = word.trim();
    const selectedSentence = sentence.trim();
    if (!selectedWord || !selectedSentence) return;

    aiRequestRef.current?.cancel();
    setAiWord(selectedWord);
    setAiSentence(selectedSentence);
    setAiResult(null);
    setAiError(false);
    setAiLoading(true);
    setAiOpen(true);

    const request = AiService.postMobileAiSend({ word: selectedWord, sentence: selectedSentence });
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
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    loadBook().then((dispose) => {
      if (cancelled) {
        dispose?.();
        return;
      }
      cleanup = dispose;
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [bookData, bookId, initialCfi]);

  const loadBook = async () => {
    if (!viewerRef.current) return;
    let cancelled = false;

    await preloadReaderFonts(configRef.current.fontFamily);

    const book = Epub(bookData);

    const rendition = book.renderTo(viewerRef.current, {
      flow: 'paginated',
      manager: 'continuous',
      width: '100%',
      height: '100%',
      // iOS Safari does not deliver touch/click events into a sandboxed iframe
      // unless allow-scripts is present; this adds it so taps reach our handlers.
      allowScriptedContent: true,
    });

    renditionRef.current = rendition;

    // Book content is rendered inside a separate iframe document, which does not
    // inherit the @font-face rules declared in index.css. Inject the font faces
    // before epub.js samples the layout, then wait for the iframe fonts to settle.
    rendition.hooks.content.register(async (contents: Contents) => {
      contentsRef.current.add(contents);
      const doc = contents.document;
      const style = doc.createElement('style');
      style.textContent = READER_FONT_FACES.map((face) =>
        `@font-face{font-family:'${face.family}';font-style:normal;font-weight:${face.weight};`
        + `font-display:block;src:${face.src};}`
      ).join('\n');
      doc.head.appendChild(style);
      await waitForContentFonts(contents);
      applyReaderStylesToContents(contents, configRef.current);
    });

    applyReaderStyles(rendition, configRef.current, [...contentsRef.current]);

    // epubjs re-emits each section's DOM events on the rendition (see passEvents),
    // so we hook taps here instead of attaching per-section listeners. touchend is
    // used on touch devices because iOS Safari often withholds the synthetic click.
    const handleTap = (doc: Document, x: number, y: number) => {
      const selection = selectWordAt(doc, x, y, highlightRef);
      if (selection) askAiRef.current(selection.word, selection.sentence);
    };

    rendition.on('click', (event: MouseEvent, contents: Contents) => {
      // Skip the click that fires at the end of a drag/swipe so a page turn
      // doesn't also select a word.
      if (dragMoved) return;
      handleTap(contents.document, event.clientX, event.clientY);
    });

    // Drag-to-turn: follow the finger by scrolling the continuous manager's
    // container, then snap to the nearest page on release. epubjs's own `snap`
    // option is intentionally off so the gesture is driven here instead.
    type DragManager = {
      container: HTMLElement;
      layout: { pageWidth: number; divisor: number; };
    };
    const getDragManager = () =>
      (rendition as unknown as { manager?: DragManager; }).manager;
    const reportCurrentLocation = () =>
      (rendition as unknown as { reportLocation?: () => void; }).reportLocation?.();

    let dragging = false;
    let dragMoved = false;
    // Track screenX, not clientX: clientX is relative to the section iframe, which
    // scrolls under the finger as we move the container and feeds back into the
    // delta. screenX is relative to the device screen and stays stable.
    let lastTouchX = 0;
    let startScrollLeft = 0;
    let cancelSnap: (() => void) | null = null;
    // Fraction of a page the finger must travel to flip to the next page. Lower
    // = more sensitive (the default Math.round behaviour was effectively 0.5).
    const SWIPE_THRESHOLD = 0.15;

    rendition.on('touchstart', (event: TouchEvent) => {
      const touch = event.touches[0];
      const manager = getDragManager();
      if (!touch || !manager) return;
      cancelSnap?.();
      cancelSnap = null;
      dragging = true;
      dragMoved = false;
      lastTouchX = touch.screenX;
      startScrollLeft = manager.container.scrollLeft;
    });

    rendition.on('touchmove', (event: TouchEvent) => {
      if (!dragging) return;
      const touch = event.touches[0];
      const manager = getDragManager();
      if (!touch || !manager) return;
      const delta = touch.screenX - lastTouchX;
      if (delta !== 0) dragMoved = true;
      manager.container.scrollLeft -= delta;
      lastTouchX = touch.screenX;
    });

    rendition.on('touchend', () => {
      if (!dragging) return;
      dragging = false;
      const manager = getDragManager();
      if (!manager || !dragMoved) return;
      const snapWidth = manager.layout.pageWidth * manager.layout.divisor;
      if (!snapWidth) return;
      // Snap relative to the page we started on: if the drag covered more than
      // SWIPE_THRESHOLD of a page, flip one page in the drag direction; otherwise
      // settle back to the start page.
      const basePage = Math.round(startScrollLeft / snapWidth);
      const dragged = manager.container.scrollLeft - basePage * snapWidth;
      let targetPage = basePage;
      if (Math.abs(dragged) > snapWidth * SWIPE_THRESHOLD) {
        targetPage = basePage + Math.sign(dragged);
      }
      const target = targetPage * snapWidth;
      cancelSnap = animateScrollLeft(manager.container, target, 200, () => {
        manager.container.scrollLeft = target;
        reportCurrentLocation();
        scheduleProgressSave();
      });
    });

    window.ePubViewer = {
      Book: {
        nextPage: () => rendition.next(),
        prevPage: () => rendition.prev(),
      },
    };

    const updateCurrentSection = (start?: SectionLocation) => {
      const match = flatTocRef.current.find((it) => hrefKey(it.href) === hrefKey(start?.href ?? ''));
      onSectionChangeRef.current(match?.label ?? null);
    };

    const scheduleProgressSave = () => {
      if (bookId == null) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

      saveTimerRef.current = setTimeout(async () => {
        await nextFrame();
        await nextFrame();
        if (cancelled) return;

        const current = (renditionRef.current?.currentLocation() as unknown as { start?: SectionLocation; })?.start;
        const cfi = visiblePointCfi(rendition) ?? current?.cfi;
        if (!cfi || cfi === lastSavedRef.current) return;

        updateCurrentSection(current);
        lastSavedRef.current = cfi;
        BooksControllersService.updateUserBookProgress(bookId, { currentRef: cfi, progress: null });
      }, 800);
    };



    // Persist the reading position whenever the page changes.
    rendition.on('relocated', (location: { start?: SectionLocation; }) => {
      const start = location?.start;
      const cfi = start?.cfi;
      if (!cfi) return;

      updateCurrentSection(start);
      scheduleProgressSave();
    });

    // Restore the saved page on load, falling back to the start of the book.
    rendition.display(initialCfi ?? undefined);

    // Load the table of contents and keep a flat copy for href→title lookups.
    book.loaded.navigation.then((nav: { toc: EpubNavItem[]; }) => {
      if (cancelled) return;
      const items = toNavItems(nav.toc);
      setToc(items);
      flatTocRef.current = flattenNav(items);

      // Reflect the section the visible rendition already shows.
      const current = (renditionRef.current?.currentLocation() as unknown as { start?: SectionLocation; })?.start;
      const match = flatTocRef.current.find((it) => hrefKey(it.href) === hrefKey(current?.href ?? ''));
      onSectionChangeRef.current(match?.label ?? null);
    });

    return () => {
      cancelled = true;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      aiRequestRef.current?.cancel();
      rendition.destroy();
      book.destroy();
      renditionRef.current = null;
      contentsRef.current.clear();
      delete window.ePubViewer;
    };
  };

  useEffect(() => {
    let cancelled = false;

    preloadReaderFonts(config.fontFamily).then(() => {
      if (cancelled || !renditionRef.current) return;
      applyReaderStyles(renditionRef.current, config, [...contentsRef.current]);
      (renditionRef.current as unknown as { reportLocation?: () => void; }).reportLocation?.();
    });

    return () => {
      cancelled = true;
    };
  }, [config]);

  return (
    <Stack sx={{ width: '100%', height: '100%', overflow: 'hidden', direction: 'rtl' }}>
      <Box ref={viewerRef} sx={{ flex: 1, minHeight: 0, width: '100%', fontSize: '30px' }} />

      <ReaderConfigDrawer
        open={settingsOpen}
        onClose={onSettingsClose}
        config={config}
        onConfigChange={onConfigChange}
      />

      <TableOfContentsDrawer
        open={tocOpen}
        onClose={onTocClose}
        toc={toc}
        onNavigate={(href) => renditionRef.current?.display(href)}
      />

      <AiResultDrawer
        open={aiOpen}
        onOpen={() => setAiOpen(true)}
        onClose={() => setAiOpen(false)}
        word={aiWord}
        sentence={aiSentence}
        loading={aiLoading}
        error={aiError}
        result={aiResult}
      />
    </Stack>
  );
}
