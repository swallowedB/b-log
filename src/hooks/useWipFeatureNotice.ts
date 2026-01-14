"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseWipFeatureNoticeOptions {
  autoCloseMs?: number;
}

export function useWipFeatureNotice(options?: UseWipFeatureNoticeOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  const autoCloseMs = options?.autoCloseMs;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const openNotice = useCallback(() => {
    clearTimer();
    setIsOpen(true);

    if (autoCloseMs) {
      timerRef.current = window.setTimeout(() => {
        setIsOpen(false);
        timerRef.current = null;
      }, autoCloseMs);
    }
  }, [autoCloseMs, clearTimer]);

  const closeNotice = useCallback(() => {
    clearTimer();
    setIsOpen(false);
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    isOpen,
    openNotice,
    closeNotice,
  };
}
