"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseDockCloseHintOptions {
  isExpanded: boolean;
  hideDelay?: number;
}

export function useDockCloseHint({
  isExpanded,
  hideDelay = 800,
}: UseDockCloseHintOptions) {
  const [showCloseHint, setShowCloseHint] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const handleNavMouseEnter = useCallback(() => {
    if (!isExpanded) return;
    clearHideTimer();
    setShowCloseHint(true);
  }, [isExpanded, clearHideTimer]);

  const handleNavMouseLeave = useCallback(() => {
    if (!isExpanded) return;
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setShowCloseHint(false);
    }, hideDelay);
  }, [isExpanded, hideDelay, clearHideTimer]);

  const hideCloseHint = useCallback(() => {
    clearHideTimer();
    setShowCloseHint(false);
  }, [clearHideTimer]);


  return {
    showCloseHint,
    handleNavMouseEnter,
    handleNavMouseLeave,
    hideCloseHint,
  };
}
