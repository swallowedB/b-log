"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";
import type { statusSection } from "../_constants/resume.data";

type StatusScale = typeof statusSection.scale;

type StatusInfoPopoverProps = {
  scale: StatusScale;
};

export default function StatusInfoPopover({ scale }: StatusInfoPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const updatePosition = () => {
      const button = buttonRef.current;

      if (!button) {
        return;
      }

      const rect = button.getBoundingClientRect();
      const popoverWidth = Math.min(304, window.innerWidth - 24);
      const left = Math.min(
        Math.max(12, rect.left),
        window.innerWidth - popoverWidth - 12,
      );
      const below = window.innerHeight - rect.bottom - 20;
      const above = rect.top - 20;
      const opensAbove = below < 352 && above > below;
      setPosition({
        left,
        top: opensAbove ? undefined : rect.bottom + 8,
        bottom: opensAbove ? window.innerHeight - rect.top + 8 : undefined,
        maxHeight: Math.min(352, opensAbove ? above : below),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (
        buttonRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Status score guide"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-foreground/15 text-foreground/75 transition hover:border-blue/35 hover:text-foreground focus-visible:outline-2 focus-visible:outline-blue"
      >
        <Info aria-hidden className="size-4" />
      </button>

      {isOpen
        ? createPortal(
            <div
              ref={popoverRef}
              role="dialog"
              aria-label="Status score guide"
              style={position}
              onWheel={(event) => event.stopPropagation()}
              onTouchMove={(event) => event.stopPropagation()}
              className="fixed z-50 w-[min(19rem,calc(100vw-1.5rem))] overflow-y-auto overscroll-contain rounded-[14px] border border-slate-200/85 bg-background p-3 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.3)] dark:border-white/10"
            >
              <div className="space-y-2">
                {scale.map((item) => (
                  <div
                    key={item.range}
                    className="border-b border-slate-200/75 pb-2 last:border-b-0 last:pb-0 dark:border-white/8"
                  >
                    <p className="text-sm leading-5 font-semibold text-foreground">
                      {item.range} · {item.label}
                    </p>
                    <p className="mt-1 text-[13px] leading-5 text-foreground/75">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
