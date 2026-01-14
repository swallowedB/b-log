"use client";

import { useState } from "react";

interface UseWipFeatureNoticeOptions {
  autoCloseMs?: number;
}


export function useWipFeatureNotice(options?: UseWipFeatureNoticeOptions) {
  const [isOpen, setIsOpen] = useState(false);

  const autoCloseMs = options?.autoCloseMs;

  const openNotice = () => {
    setIsOpen(true);

    if (autoCloseMs) {
      window.setTimeout(() => {
        setIsOpen(false);
      }, autoCloseMs);
    }
  };

  const closeNotice = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openNotice,
    closeNotice,
  };
}
