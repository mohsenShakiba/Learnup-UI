import { create } from "zustand";

export type ToastSeverity = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  /** How long the toast stays visible, in ms. Defaults to 4000. */
  duration?: number;
}

export interface Toast {
  id: number;
  message: string;
  severity: ToastSeverity;
  duration: number;
}

interface ToastState {
  toasts: Toast[];
  show: (
    message: string,
    severity: ToastSeverity,
    options?: ToastOptions,
  ) => number;
  dismiss: (id: number) => void;
}

let nextId = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (message, severity, options) => {
    const id = ++nextId;
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          message,
          severity,
          duration: options?.duration ?? 4000,
        },
      ],
    }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

const show = (
  message: string,
  severity: ToastSeverity,
  options?: ToastOptions,
) => useToastStore.getState().show(message, severity, options);

/**
 * Imperative toast API. Call from any component or plain module:
 *
 *   toast.success("Saved!");
 *   toast.error("Something went wrong");
 */
export const toast = {
  success: (message: string, options?: ToastOptions) =>
    show(message, "success", options),
  error: (message: string, options?: ToastOptions) =>
    show(message, "error", options),
  warning: (message: string, options?: ToastOptions) =>
    show(message, "warning", options),
  info: (message: string, options?: ToastOptions) =>
    show(message, "info", options),
  dismiss: (id: number) => useToastStore.getState().dismiss(id),
};
