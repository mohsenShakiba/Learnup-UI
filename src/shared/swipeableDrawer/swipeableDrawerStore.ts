import type { ReactNode } from "react";
import type { SwipeableDrawerProps, SxProps, Theme } from "@mui/material";
import { create } from "zustand";

export type SwipeableDrawerAnchor = NonNullable<SwipeableDrawerProps["anchor"]>;

export interface SwipeableDrawerOptions {
  anchor?: SwipeableDrawerAnchor;
  disableBackdropTransition?: boolean;
  disableDiscovery?: boolean;
  keepMounted?: boolean;
  onClose?: () => void;
  paperSx?: SxProps<Theme>;
}

export interface SwipeableDrawerItem {
  id: number;
  content: ReactNode;
  anchor: SwipeableDrawerAnchor;
  disableBackdropTransition: boolean;
  disableDiscovery: boolean;
  keepMounted: boolean;
  onClose?: () => void;
  paperSx?: SxProps<Theme>;
}

interface SwipeableDrawerState {
  drawer: SwipeableDrawerItem | null;
  show: (content: ReactNode, options?: SwipeableDrawerOptions) => number;
  close: (id?: number) => void;
}

let nextId = 0;

export const useSwipeableDrawerStore = create<SwipeableDrawerState>((set) => ({
  drawer: null,
  show: (content, options) => {
    const id = ++nextId;

    set({
      drawer: {
        id,
        content,
        anchor: options?.anchor ?? "bottom",
        disableBackdropTransition: options?.disableBackdropTransition ?? false,
        disableDiscovery: options?.disableDiscovery ?? false,
        keepMounted: options?.keepMounted ?? true,
        onClose: options?.onClose,
        paperSx: options?.paperSx,
      },
    });

    return id;
  },
  close: (id) =>
    set((state) => {
      if (id != null && state.drawer?.id !== id) {
        return state;
      }

      state.drawer?.onClose?.();
      return { drawer: null };
    }),
}));

export const showDrawer = (
  content: ReactNode,
  options?: SwipeableDrawerOptions,
) => useSwipeableDrawerStore.getState().show(content, options);

export const closeDrawer = (id?: number) =>
  useSwipeableDrawerStore.getState().close(id);

export const swipeableDrawer = {
  show: showDrawer,
  close: closeDrawer,
};

export const swipableDrawer = swipeableDrawer;
