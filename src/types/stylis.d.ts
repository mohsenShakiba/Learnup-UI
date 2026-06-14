declare module 'stylis' {
  export interface Element {
    type: string;
    value: string;
    props: string[] | string;
    root: Element | null;
    parent: Element | null;
    children: Element[] | string;
    line: number;
    column: number;
    length: number;
    return: string;
  }

  export type Middleware = (
    element: Element,
    index: number,
    children: Element[],
    callback: Middleware,
  ) => string | void;

  export const prefixer: Middleware;
}
