declare module 'foliate-js/overlayer.js' {
  // SVG-overlay highlighter: measures range.getClientRects() and paints
  // absolutely-positioned rects over the page, mutating no document nodes.
  type DrawFunc = (rects: DOMRect[], options?: Record<string, unknown>) => Element;

  export class Overlayer {
    constructor (doc: Document);
    add (key: string, range: Range, draw: DrawFunc, options?: Record<string, unknown>): void;
    remove (key: string): void;
    redraw (): void;
    static highlight: DrawFunc;
    static underline: DrawFunc;
    static outline: DrawFunc;
  }
}

declare module 'foliate-js/view.js' {
  export class ResponseError extends Error {}
  export class NotFoundError extends Error {}
  export class UnsupportedTypeError extends Error {}

  export function makeBook(file: File | Blob | string): Promise<unknown>;

  export class View extends HTMLElement {
    book: unknown;
    renderer?: HTMLElement & { setStyles?: (css: string) => void; };
    lastLocation?: unknown;
    open(book: File | Blob | string | unknown): Promise<void>;
    init(options: { lastLocation?: string; showTextStart?: boolean; }): Promise<void>;
    goTo(target: string | number | { fraction: number; }): Promise<unknown>;
    close(): void;
  }
}
