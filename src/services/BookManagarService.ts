import { Theme } from '@mui/material';
import ePub, { Book, Contents, Rendition } from 'epubjs';
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

// epubjs navigation item shape (the subset we read).
export interface EpubNavItem {
  id?: string;
  href: string;
  label: string;
  subitems?: EpubNavItem[];
}

type DragManager = {
  container: HTMLElement;
  layout: { pageWidth: number; divisor: number; };
};

export type BookPageInfo = {
  currentPage: number | null;
  totalPages: number | null;
  sectionTitle: string;
  display: boolean;
};

export class BookManagarService {
  private bookResponse: UserBookResponse | null = null;
  private book: Book | null = null;
  private element: HTMLElement | null = null;
  private bookData: ArrayBuffer | null = null;
  private initialCfi: string | undefined = undefined;
  config: ReaderConfig | null = null;
  private highlightRef: { current: HTMLElement | null; } = { current: null };
  private rendition: Rendition | null = null;
  private currentLocation: SectionLocation | null = null;
  private theme: Theme | null = null;
  private onPageInfoChange: ((pageInfo: BookPageInfo) => void) | null = null;
  private shouldDisplay = false;

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

    const book = ePub(this.bookData!);

    this.book = book;

    const rendition = book.renderTo(element, {
      flow: 'paginated',
      manager: 'continuous',
      width: '100%',
      height: '100%',
      allowScriptedContent: true,
    });

    this.rendition = rendition;

    this.setupReaderStyles();
    this.setupTouchEvents();
    this.setupClickEvent();
    this.setupRelocateEvent();

    book.loaded.navigation.then((nav: { toc: EpubNavItem[]; }) => {
      this.navItems = nav.toc;
    });

    this.applyConfig(config);
    await rendition.display();
  }

  // called by toc drawer to change chapter
  setHref = async (href: string): Promise<void> => {
    if (!this.rendition) return;
    await this.rendition.display(href);
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
    this.rendition?.destroy();
    this.book?.destroy();
    this.element = null;
    this.onPageInfoChange = null;
  };

  private setupTouchEvents () {
    const rendition = this.rendition;
    if (rendition === null) return;

    let lastTouchX = 0;
    let startScrollLeft = 0;
    let lastPage = 0;

    const SWIPE_THRESHOLD = 0.15;
    const getDragManager = () => (rendition as { manager?: DragManager; }).manager;

    rendition.on('touchstart', (event: TouchEvent) => {
      const touch = event.touches[0];
      const manager = getDragManager();
      if (!touch || !manager) return;
      lastTouchX = touch.screenX;
      startScrollLeft = manager.container.scrollLeft;
    });

    rendition.on('touchmove', (event: TouchEvent) => {
      const touch = event.touches[0];
      const manager = getDragManager();
      if (!touch || !manager) return;
      const delta = touch.screenX - lastTouchX;
      manager.container.scrollLeft -= delta;
      lastTouchX = touch.screenX;
    });

    rendition.on('touchend', () => {
      const manager = getDragManager();
      if (!manager) return;

      const snapWidth = manager.layout.pageWidth * manager.layout.divisor;
      const basePage = Math.round(startScrollLeft / snapWidth);
      const dragged = manager.container.scrollLeft - basePage * snapWidth;

      let targetPage = basePage;
      if (Math.abs(dragged) > snapWidth * SWIPE_THRESHOLD) {
        targetPage = basePage + Math.sign(dragged);
      }

      let target = targetPage * snapWidth;

      if (lastPage !== 0 && Math.abs(target - lastPage) > 1) {
        target = lastPage;
      }

      manager.container.scrollTo({
        left: target,
        behavior: 'smooth',
      });
    });
  }

  private setupClickEvent () {

    const rendition = this.rendition;
    if (rendition === null) return;

    rendition.on('click', (event: MouseEvent, content: Contents) => {
      const selection = detectSentenceAtPoint(content.document, event.clientX, event.clientY, this.highlightRef);
      // todo: show translation
    });
  }

  private setupRelocateEvent () {
    const rendition = this.rendition;
    const bookResponse = this.bookResponse;

    if (rendition === null) return;
    if (bookResponse === null) return;

    rendition.on('relocated', (location: { start?: SectionLocation; }) => {
      if (!location?.start?.cfi) return;
      this.currentLocation = location.start;
      // this.initialCfi = location.start.cfi;
      this.emitPageInfo();
      // BooksControllersService.updateUserBookProgress(bookResponse.id, {
      //   currentRef: location.start.cfi,
      //   progress: 0
      // });
    });
  }

  saveCurrentPage = () => {
    BooksControllersService.updateUserBookProgress(this.bookResponse!.id, {
      currentRef: this.currentLocation!.cfi!,
      progress: 0
    });
  };

  private emitPageInfo (): void {
    if (!this.onPageInfoChange) return;
    this.onPageInfoChange({
      currentPage: (this.currentLocation?.displayed.page ?? 0),
      totalPages: (this.currentLocation?.displayed.total ?? 0),
      sectionTitle: this.getCurrentSection() ?? '',
      display: this.shouldDisplay
    });
  }

  private setupReaderStyles (): void {
    const rendition = this.rendition;
    if (rendition === null) {
      return;
    }

    rendition.hooks.content.register(async (contents: Contents) => {
      this.injectReaderFontFaces(contents);
      setTimeout(async () => {
        rendition.display(this.initialCfi);
        setTimeout(() => {
          rendition.display(this.initialCfi);
          this.shouldDisplay = true;
          this.emitPageInfo();
        }, 1000);
      }, 1000);
    });
  }

  private injectReaderFontFaces (contents: Contents): void {
    const document = contents.document;
    if (document.getElementById('learnup-reader-fonts')) return;
    const style = document.createElement('style');
    style.id = 'learnup-reader-fonts';
    style.textContent = READER_FONTS.map((face) => face.fontFace).join('\n');
    document.head.appendChild(style);
  }

  private applyConfig (config: ReaderConfig): void {
    const rendition = this.rendition;
    if (rendition === null) return;

    rendition.themes.default({
      'body': {
        'background': this.theme?.palette.background.default,
        'color': this.theme?.palette.text.primary,
      },
      'body *': {
        'font-family': `${config.fontFamily} !important`,
        'font-size': `${config.fontSize}px !important`,
      },
    });
  }

  // returns the current chapter title
  private getCurrentSection () {
    const currentNav = this.navItems.find(n => hrefKey(n.href) === hrefKey(this.currentLocation?.href ?? ''));
    return currentNav?.label;
  };

}

function hrefKey (href: string): string {
  return href.split('#')[0].split('/').pop() ?? href;
}
