import { Theme } from '@mui/material';
import 'foliate-js/view.js';
import { BooksControllersService, UserBookResponse } from '../api/Learnup';
import { getCachedBook } from '../stores/bookCache';
import { SectionLocation } from '../utils/Calculate';
import { loadReaderConfig, saveReaderConfig } from './BookConfig';
import { getFileById } from './fetchFile';
import {
  READER_FONTS,
  ReaderConfig,
} from './readerTypes';
import { detectSentenceAtPoint, HighlightRef, SectionOverlayer, SentenceDetectionResult } from './SentenceDetection';

export interface EpubNavItem {
  id?: string;
  href: string;
  label: string;
  subitems?: EpubNavItem[];
}

export type BookPageInfo = {
  currentPage: number | string | null;
  totalPages: number | string | null;
  sectionTitle: string;
  display: boolean;
};

export class BookManagarService {
  private bookResponse: UserBookResponse | null = null;
  private book: FoliateBook | null = null;
  private element: HTMLElement | null = null;
  private bookData: ArrayBuffer | null = null;
  private initialCfi: string | undefined = undefined;
  config: ReaderConfig | null = null;
  private highlightRef: HighlightRef = { current: null };
  private view: FoliateViewElement | null = null;
  private currentLocation: SectionLocation | null = null;
  private theme: Theme | null = null;
  private onPageInfoChange: ((pageInfo: BookPageInfo) => void) | null = null;
  private onWordSelect: ((selection: SentenceDetectionResult) => void) | null = null;
  private shouldDisplay = false;
  private saveProgressTimeout: ReturnType<typeof setTimeout> | null = null;
  private lastSavedProgressKey: string | null = null;
  private visualPageLocation: VisualPageLocation | null = null;
  private sectionPageCounts = new Map<number, number>();

  navItems: EpubNavItem[] = [];

  public isReady(): boolean {
    return !!this.bookData;
  }

  public async display(
    bookResponse: UserBookResponse,
    element: HTMLElement,
    theme: Theme,
    handler: ((pageInfo: BookPageInfo) => void),
    onWordSelect?: (selection: SentenceDetectionResult) => void,
  ): Promise<void> {

    this.onPageInfoChange = handler;
    this.onWordSelect = onWordSelect ?? null;
    this.theme = theme;
    this.config = loadReaderConfig();
    this.initialCfi = bookResponse.currentRef ?? undefined;
    this.currentLocation = null;
    this.visualPageLocation = null;
    this.sectionPageCounts.clear();
    this.emitPageInfo();
    this.bookData = await getCachedBook(bookResponse.id);

    if (!this.bookData) {
      this.bookData = await getFileById(bookResponse.fileName);
    }

    this.element = element;
    this.bookResponse = bookResponse;

    const config = this.config;

    if (!this.bookData) {
      throw new Error('Book data must be set before mounting the reader.');
    }

    if (!this.config) {
      throw new Error('Reader config must be set before mounting the reader.');
    }

    const view = document.createElement('foliate-view') as FoliateViewElement;
    view.style.width = '100%';
    view.style.height = '100%';
    view.style.display = 'block';
    element.replaceChildren(view);
    this.view = view;

    this.setupReaderStyles();
    this.setupClickEvent();
    this.setupRelocateEvent();

    await view.open(new File([this.bookData], bookResponse.title ?? 'book.epub', { type: 'application/epub+zip' }));
    this.book = view.book;
    this.navItems = view.book?.toc ?? [];
    view.renderer?.setAttribute('animated', '');
    this.setupVisualPageEvent();

    console.log('ref', this.initialCfi);

    this.applyConfig(config);
    await view.init({ lastLocation: this.initialCfi, showTextStart: !this.initialCfi });
  }

  // called by toc drawer to change chapter
  setHref = async (href: string): Promise<void> => {
    if (!this.view) return;
    await this.view.goTo(href);
  };

  // called by config drawer to update the config
  setConfig = async (config: Partial<ReaderConfig>) => {
    const existingConfig = this.config;
    if (existingConfig === null) {
      return;
    }
    const nextConfig = { ...(existingConfig), ...config };
    this.config = nextConfig;
    saveReaderConfig(nextConfig);
    this.applyConfig(nextConfig);
  };

  // clear references to rendition and book
  dispose = () => {
    this.view?.close();
    this.view?.remove();
    this.book?.destroy?.();
    if (this.saveProgressTimeout) {
      clearTimeout(this.saveProgressTimeout);
      this.saveProgressTimeout = null;
    }
    this.element = null;
    this.onPageInfoChange = null;
    this.onWordSelect = null;
  };

  private setupClickEvent() {

    const view = this.view;
    if (view === null) return;

    const LONG_PRESS_DURATION = 500;
    const MOVE_TOLERANCE = 10;

    view.addEventListener('load', ((event: CustomEvent<FoliateLoadDetail>) => {
      const doc = event.detail.doc;

      let longPressTimeout: ReturnType<typeof setTimeout> | null = null;
      let startX = 0;
      let startY = 0;

      const cancelLongPress = () => {
        if (longPressTimeout !== null) {
          clearTimeout(longPressTimeout);
          longPressTimeout = null;
        }
      };

      doc.addEventListener('pointerdown', (pointerEvent: PointerEvent) => {
        startX = pointerEvent.clientX;
        startY = pointerEvent.clientY;
        cancelLongPress();
        longPressTimeout = setTimeout(() => {
          longPressTimeout = null;
          const overlayer = this.getOverlayerForDoc(doc);
          const selection = detectSentenceAtPoint(doc, startX, startY, overlayer, this.highlightRef);
          if (selection) {
            this.onWordSelect?.(selection);
          }
        }, LONG_PRESS_DURATION);
      });

      doc.addEventListener('pointermove', (pointerEvent: PointerEvent) => {
        if (longPressTimeout === null) return;
        if (
          Math.abs(pointerEvent.clientX - startX) > MOVE_TOLERANCE ||
          Math.abs(pointerEvent.clientY - startY) > MOVE_TOLERANCE
        ) {
          cancelLongPress();
        }
      });

      doc.addEventListener('pointerup', cancelLongPress);
      doc.addEventListener('pointercancel', cancelLongPress);
      doc.addEventListener('pointerleave', cancelLongPress);
    }) as EventListener);
  }

  // foliate creates one Overlayer per rendered section; find the one whose
  // document matches the section the long-press happened in, so highlights are
  // drawn into the correct overlay.
  private getOverlayerForDoc(doc: Document): SectionOverlayer | null {
    const contents = this.view?.renderer?.getContents?.() ?? [];
    return contents.find((content) => content.doc === doc)?.overlayer ?? null;
  }

  private setupRelocateEvent() {
    const view = this.view;
    const bookResponse = this.bookResponse;

    if (view === null) return;
    if (bookResponse === null) return;

    view.addEventListener('relocate', ((event: CustomEvent<SectionLocation>) => {
      if (!event.detail?.cfi) return;
      this.currentLocation = event.detail;
      this.emitPageInfo();
      this.scheduleProgressSave(bookResponse.id, event.detail);
    }) as EventListener);
  }

  private setupVisualPageEvent() {
    const renderer = this.view?.renderer;
    if (!renderer) return;

    renderer.addEventListener('relocate', ((event: CustomEvent<RendererLocationDetail>) => {
      const { index } = event.detail;
      if (typeof index !== 'number') return;

      const currentPage = typeof renderer.page === 'number' ? renderer.page : null;
      const totalPages = typeof renderer.pages === 'number' ? renderer.pages : null;
      const sectionPages = totalPages === null
        ? 1
        : Math.max(1, totalPages - 2);

      this.sectionPageCounts.set(index, sectionPages);

      this.visualPageLocation = {
        index,
        page: currentPage === null ? 1 : Math.max(1, Math.min(currentPage, sectionPages)),
        pages: sectionPages,
      };

      this.emitPageInfo();
    }) as EventListener);
  }

  saveCurrentPage = () => {
    if (!this.bookResponse || !this.currentLocation?.cfi) return;
    if (this.saveProgressTimeout) {
      clearTimeout(this.saveProgressTimeout);
      this.saveProgressTimeout = null;
    }
    BooksControllersService.updateUserBookProgress(this.bookResponse!.id, {
      currentRef: this.currentLocation!.cfi!,
      progress: this.getLocationProgress(this.currentLocation)
    });
  };

  private scheduleProgressSave(bookId: number, location: SectionLocation): void {
    if (!location.cfi) return;

    const progress = this.getLocationProgress(location);
    const progressKey = `${location.cfi}:${progress}`;
    if (progressKey === this.lastSavedProgressKey) return;

    if (this.saveProgressTimeout) {
      clearTimeout(this.saveProgressTimeout);
    }

    this.saveProgressTimeout = setTimeout(() => {
      this.saveProgressTimeout = null;
      BooksControllersService.updateUserBookProgress(bookId, {
        currentRef: location.cfi!,
        progress,
      }).then(() => {
        this.lastSavedProgressKey = progressKey;
      }).catch((error) => {
        console.error('Failed to save book progress', error);
      });
    }, 1000);
  }

  private emitPageInfo(): void {
    if (!this.onPageInfoChange) return;
    const { currentPage, totalPages } = this.getPageCounts(this.currentLocation);
    this.onPageInfoChange({
      currentPage,
      totalPages,
      sectionTitle: this.getCurrentSection() ?? '',
      display: this.shouldDisplay
    });
  }

  private getPageCounts(location: SectionLocation | null): Pick<BookPageInfo, 'currentPage' | 'totalPages'> {
    if (!location) {
      return { currentPage: null, totalPages: null };
    }

    const visualPages = this.getVisualPageCounts();
    if (visualPages.currentPage !== null) {
      return visualPages;
    }

    const pageList = this.book?.pageList ?? [];
    if (location.pageItem?.label) {
      return {
        currentPage: location.pageItem.label,
        totalPages: getLastPageLabel(pageList) ?? (pageList.length || null),
      };
    }

    return { currentPage: null, totalPages: null };
  }

  private getVisualPageCounts(): Pick<BookPageInfo, 'currentPage' | 'totalPages'> {
    if (!this.visualPageLocation || !this.book?.sections?.length) {
      return { currentPage: null, totalPages: null };
    }

    const { index, page } = this.visualPageLocation;
    const pagesBefore = this.getPageCountBeforeSection(index);
    const totalPages = this.getEstimatedTotalPageCount();

    return {
      currentPage: pagesBefore + page,
      totalPages,
    };
  }

  private getPageCountBeforeSection(sectionIndex: number): number {
    let total = 0;
    for (let index = 0; index < sectionIndex; index += 1) {
      total += this.getSectionPageCount(index);
    }
    return total;
  }

  private getEstimatedTotalPageCount(): number {
    const sections = this.book?.sections ?? [];
    return sections.reduce((total, _section, index) => total + this.getSectionPageCount(index), 0);
  }

  private getSectionPageCount(sectionIndex: number): number {
    const knownCount = this.sectionPageCounts.get(sectionIndex);
    if (knownCount) return knownCount;

    const sections = this.book?.sections ?? [];
    const section = sections[sectionIndex];
    const knownRatios = [...this.sectionPageCounts.entries()]
      .map(([index, pageCount]) => {
        const size = sections[index]?.size ?? 0;
        return size > 0 ? pageCount / size : null;
      })
      .filter((ratio): ratio is number => ratio !== null);

    const averagePagesPerSize = knownRatios.length
      ? knownRatios.reduce((sum, ratio) => sum + ratio, 0) / knownRatios.length
      : 1 / 1500;

    return Math.max(1, Math.round((section?.size ?? 1500) * averagePagesPerSize));
  }

  private getLocationProgress(location: SectionLocation | null): number {
    if (location?.fraction == null) return 0;
    return Math.max(1, Math.min(100, Math.round(location.fraction * 100)));
  }

  private setupReaderStyles(): void {
    const view = this.view;
    if (view === null) {
      return;
    }

    view.addEventListener('load', ((event: CustomEvent<FoliateLoadDetail>) => {
      const doc = event.detail.doc;
      if (this.config) this.applyConfigToDocument(doc, this.config);
      void this.waitForFontReady(doc).then(() => {
        this.shouldDisplay = true;
        this.emitPageInfo();
      });
    }) as EventListener);
  }

  // resolves once the configured reader font has finished loading in the
  // section document, so the book is only revealed with its final font applied.
  private async waitForFontReady(doc: Document): Promise<void> {
    const fonts = (doc as Document & { fonts?: FontFaceSet; }).fonts;
    if (!fonts) return;

    try {
      const fontFamily = this.config?.fontFamily;
      const fontSize = this.config?.fontSize ?? 16;
      if (fontFamily) {
        await fonts.load(`${fontSize}px ${JSON.stringify(fontFamily)}`);
      }
      await fonts.ready;
    } catch {
      // ignore font loading failures; fall back to showing the book anyway.
    }
  }

  private applyConfigToDocument(document: Document, config: ReaderConfig): void {
    const style = document.getElementById('learnup-reader-config') ?? document.createElement('style');
    style.id = 'learnup-reader-config';
    style.textContent = this.getReaderCss(config);
    document.head.appendChild(style);
  }

  private applyConfig(config: ReaderConfig): void {
    const view = this.view;
    if (view === null) return;
    const css = this.getReaderCss(config);

    view.renderer?.setStyles?.(css);
    for (const content of view.renderer?.getContents?.() ?? []) {
      this.applyConfigToDocument(content.doc, config);
    }
  }

  private getReaderCss(config: ReaderConfig): string {
    const fontFamily = JSON.stringify(config.fontFamily);
    const fontStack = `${fontFamily}, serif`;
    const fontSize = `${config.fontSize}px`;
    const textAlign = config.textAlign ?? 'left';
    const fontFaces = READER_FONTS.map((face) => {
      const source = new URL(face.source, window.location.origin).href;
      return `@font-face{font-family:${JSON.stringify(face.key)};font-style:normal;font-weight:400;font-display:swap;src:url("${source}") format("${face.format}");}`;
    }).join('\n');

    return `
      ${fontFaces}
      html,
      body {
        background: ${this.theme?.palette.background.default};
        color: ${this.theme?.palette.text.primary};
        font-family: ${fontStack} !important;
        font-size: ${fontSize} !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      body *:not(svg):not(svg *) {
        font-family: ${fontStack} !important;
      }
      body,
      body p,
      body div,
      body span,
      body li,
      body blockquote,
      body section,
      body article,
      body h1,
      body h2,
      body h3,
      body h4,
      body h5,
      body h6 {
        font-size: ${fontSize} !important;
      }
      body p,
      body div,
      body li,
      body blockquote {
        text-align: ${textAlign} !important;
      }
    `;
  }

  // returns the current chapter title
  private getCurrentSection() {
    const currentHref = this.currentLocation?.tocItem?.href ?? '';
    const currentNav = this.navItems.find(n => hrefKey(n.href) === hrefKey(currentHref));
    if (this.currentLocation?.tocItem?.label) return this.currentLocation.tocItem.label;
    return currentNav?.label;
  };

}

function hrefKey(href: string): string {
  return href.split('#')[0].split('/').pop() ?? href;
}

function getLastPageLabel(pageList: EpubNavItem[]): string | null {
  for (let i = pageList.length - 1; i >= 0; i -= 1) {
    const item = pageList[i];
    if (item.label) return item.label;
  }
  return null;
}

type FoliateBook = {
  toc?: EpubNavItem[];
  pageList?: EpubNavItem[];
  sections?: Array<{ size?: number; linear?: string; }>;
  destroy?: () => void;
};

type FoliateRenderer = HTMLElement & {
  page?: number;
  pages?: number;
  setStyles?: (css: string) => void;
  getContents?: () => Array<{ doc: Document; index: number; overlayer?: SectionOverlayer; }>;
};

type RendererLocationDetail = {
  index?: number;
  fraction?: number;
  size?: number;
};

type VisualPageLocation = {
  index: number;
  page: number;
  pages: number;
};

type FoliateLoadDetail = {
  doc: Document;
  index: number;
};

type FoliateViewElement = HTMLElement & {
  book: FoliateBook;
  renderer?: FoliateRenderer;
  lastLocation?: SectionLocation;
  open: (book: File | Blob | string | FoliateBook) => Promise<void>;
  init: (options: { lastLocation?: string; showTextStart?: boolean; }) => Promise<void>;
  goTo: (target: string | number | { fraction: number; }) => Promise<unknown>;
  close: () => void;
};
