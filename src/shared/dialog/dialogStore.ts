import { create } from "zustand";
import type { ComponentType } from "react";

export type DialogComponent = ComponentType;

interface DialogStoreState {
  component: DialogComponent | null;
  show: (component: DialogComponent) => void;
  close: () => void;
}

export const useDialogStore = create<DialogStoreState>((set) => ({
  component: null,
  show: (component) => set({ component }),
  close: () => set({ component: null }),
}));

export const dialogStore = {
  show: (component: DialogComponent) => useDialogStore.getState().show(component),
  close: () => useDialogStore.getState().close(),
};
