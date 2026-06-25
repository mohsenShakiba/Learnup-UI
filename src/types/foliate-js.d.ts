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
