"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "left" | "right";

interface UseTagScrollerOptions {
  visibleCount?: number;
  overlaySpace?: number;
  gapPx?: number;
  epsilon?: number;
}

export function useTagScroller(options: UseTagScrollerOptions = {}) {
  const {
    visibleCount = 7,
    overlaySpace = 56,
    gapPx = 8,
    epsilon = 2,
  } = options;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);

  const [visibleWidth, setVisibleWidth] = useState(480);
  const [hasLeftOverflow, setHasLeftOverflow] = useState(false);
  const [hasRightOverflow, setHasRightOverflow] = useState(false);

  const updateOverflow = () => {
    const el = scrollRef.current;
    if (!el) return;

    const left = el.scrollLeft;
    const rightRemaining = el.scrollWidth - el.clientWidth - el.scrollLeft;

    setHasLeftOverflow(left > epsilon);
    setHasRightOverflow(rightRemaining > epsilon);
  };

  const computeVisibleWidth = () => {
    const el = measureRef.current;
    if (!el) return;

    const buttons = el.querySelectorAll("button");
    if (!buttons.length) return;

    let total = 0;
    const count = Math.min(visibleCount, buttons.length);

    for (let i = 0; i < count; i++) {
      total += (buttons[i] as HTMLElement).offsetWidth;
      if (i !== count - 1) total += gapPx;
    }

    setVisibleWidth(total + overlaySpace);
  };

  useEffect(() => {
    computeVisibleWidth();
    const raf = requestAnimationFrame(() => {
      computeVisibleWidth();
      updateOverflow();
    });

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateOverflow();
    el.addEventListener("scroll", updateOverflow, { passive: true });
    window.addEventListener("resize", updateOverflow);

    return () => {
      el.removeEventListener("scroll", updateOverflow);
      window.removeEventListener("resize", updateOverflow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slide = (direction: Direction) => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = el.clientWidth * 0.8;
    el.scrollTo({
      left: direction === "left" ? el.scrollLeft - amount : el.scrollLeft + amount,
      behavior: "smooth",
    });

    requestAnimationFrame(updateOverflow);
    setTimeout(updateOverflow, 220);
  };

  return {
    scrollRef,
    measureRef,
    visibleWidth,
    hasLeftOverflow,
    hasRightOverflow,
    slide,
    updateOverflow,
  };
}
