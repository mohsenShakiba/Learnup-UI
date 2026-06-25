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
import { detectSentenceAtPoint } from './SentenceDetection';

export interface EpubNavItem {
  id?: string;
  href: string;
  label: string;
  subitems?: EpubNavItem[];
}

export type BookPageInfo = {
  currentPage: number | null;
  totalPages: number | null;
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
  private highlightRef: { current: HTMLElement | null; } = { current: null };
  private view: FoliateViewElement | null = null;
  private currentLocation: SectionLocation | null = null;
  private theme: Theme | null = null;
  private onPageInfoChange: ((pageInfo: BookPageInfo) => void) | null = null;
  private shouldDisplay = false;
  private saveProgressTimeout: ReturnType<typeof setTimeout> | null = null;
  private lastSavedProgressKey: string | null = null;

  navItems: EpubNavItem[] = [];

  public isReady (): boolean {
    return !!this.bookData;
  }

  public async display (bookResponse: UserBookResponse, element: HTMLElement, theme: Theme, handler: ((pageInfo: BookPageInfo) => void)): Promise<void> {

    this.onPageInfoChange = handler;
    this.theme = theme;
    this.config = loadReaderConfig();
    this.initialCfi = bookResponse.currentRef ?? undefined;
    this.currentLocation = null;
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
    console.log('config', this.config);
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
  };

  private setupClickEvent () {

    const view = this.view;
    if (view === null) return;

    view.addEventListener('load', ((event: CustomEvent<FoliateLoadDetail>) => {
      const doc = event.detail.doc;
      doc.addEventListener('click', (clickEvent: MouseEvent) => {
        const selection = detectSentenceAtPoint(doc, clickEvent.clientX, clickEvent.clientY, this.highlightRef);
        void selection;
      });
      // todo: show translation
    }) as EventListener);
  }

  private setupRelocateEvent () {
    const view = this.view;
    const bookResponse = this.bookResponse;

    if (view === null) return;
    if (bookResponse === null) return;

    view.addEventListener('relocate', ((event: CustomEvent<SectionLocation>) => {
      if (!event.detail?.cfi) return;
      this.currentLocation = event.detail;
      // this.initialCfi = location.start.cfi;
      this.emitPageInfo();
      this.scheduleProgressSave(bookResponse.id, event.detail);
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

  private scheduleProgressSave (bookId: number, location: SectionLocation): void {
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

  private emitPageInfo (): void {
    if (!this.onPageInfoChange) return;
    const progressPage = this.getLocationProgress(this.currentLocation);
    this.onPageInfoChange({
      currentPage: progressPage,
      totalPages: this.currentLocation ? 100 : 0,
      sectionTitle: this.getCurrentSection() ?? '',
      display: this.shouldDisplay
    });
  }

  private getLocationProgress (location: SectionLocation | null): number {
    if (location?.fraction == null) return 0;
    return Math.max(1, Math.min(100, Math.round(location.fraction * 100)));
  }

  private setupReaderStyles (): void {
    const view = this.view;
    if (view === null) {
      return;
    }

    view.addEventListener('load', ((event: CustomEvent<FoliateLoadDetail>) => {
      if (this.config) this.applyConfigToDocument(event.detail.doc, this.config);
      this.shouldDisplay = true;
      this.emitPageInfo();
    }) as EventListener);
  }

  private applyConfigToDocument (document: Document, config: ReaderConfig): void {
    const style = document.getElementById('learnup-reader-config') ?? document.createElement('style');
    style.id = 'learnup-reader-config';
    style.textContent = this.getReaderCss(config);
    document.head.appendChild(style);
  }

  private applyConfig (config: ReaderConfig): void {
    const view = this.view;
    if (view === null) return;
    const css = this.getReaderCss(config);

    view.renderer?.setStyles?.(css);
    for (const content of view.renderer?.getContents?.() ?? []) {
      this.applyConfigToDocument(content.doc, config);
    }
  }

  private getReaderCss (config: ReaderConfig): string {
    const fontFamily = JSON.stringify(config.fontFamily);
    const fontStack = `${fontFamily}, serif`;
    const fontSize = `${config.fontSize}px`;
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
    `;
  }

  // returns the current chapter title
  private getCurrentSection () {
    const currentHref = this.currentLocation?.tocItem?.href ?? '';
    const currentNav = this.navItems.find(n => hrefKey(n.href) === hrefKey(currentHref));
    if (this.currentLocation?.tocItem?.label) return this.currentLocation.tocItem.label;
    return currentNav?.label;
  };

}

function hrefKey (href: string): string {
  return href.split('#')[0].split('/').pop() ?? href;
}

type FoliateBook = {
  toc?: EpubNavItem[];
  destroy?: () => void;
};

type FoliateRenderer = HTMLElement & {
  setStyles?: (css: string) => void;
  getContents?: () => Array<{ doc: Document; index: number; }>;
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
