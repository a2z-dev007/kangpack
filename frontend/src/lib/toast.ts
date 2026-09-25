import React from "react";
import { gooeyToast, type GooeyToastOptions, type GooeyPromiseData } from "goey-toast";

export type ToastMessage = string | number | React.ReactNode;

function formatMessage(message: ToastMessage): string {
  if (typeof message === "string") return message;
  if (typeof message === "number") return String(message);
  if (!message) return "";
  return String(message);
}

/**
 * Reusable Gooey Toast Utility
 * Powered by goey-toast and framer-motion with organic blob morphing animations.
 */
export const toast = Object.assign(
  (message: ToastMessage, options?: GooeyToastOptions) => {
    return gooeyToast(formatMessage(message), options);
  },
  {
    success: (message: ToastMessage, options?: GooeyToastOptions) => {
      return gooeyToast.success(formatMessage(message), options);
    },
    error: (message: ToastMessage, options?: GooeyToastOptions) => {
      return gooeyToast.error(formatMessage(message), options);
    },
    warning: (message: ToastMessage, options?: GooeyToastOptions) => {
      return gooeyToast.warning(formatMessage(message), options);
    },
    info: (message: ToastMessage, options?: GooeyToastOptions) => {
      return gooeyToast.info(formatMessage(message), options);
    },
    promise: <T>(promise: Promise<T>, data: GooeyPromiseData<T>) => {
      return gooeyToast.promise(promise, data);
    },
    dismiss: (idOrFilter?: any) => {
      return gooeyToast.dismiss(idOrFilter);
    },
    update: (id: string | number, options: any) => {
      return gooeyToast.update(id, options);
    },
    raw: gooeyToast,
  }
);

export type { GooeyToastOptions, GooeyPromiseData };
export default toast;
