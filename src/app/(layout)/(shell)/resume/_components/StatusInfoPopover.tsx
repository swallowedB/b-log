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
  const [position, setPosition] = useState({ left: 0, top: 0 });
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

      setPosition({
        left,
        top: rect.bottom + 8,
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
        className="flex size-4 shrink-0 items-center justify-center rounded-full border border-slate-200/85 bg-white/90 text-foreground/58 transition hover:border-blue/35 hover:text-blue dark:border-white/10 dark:bg-white/4 dark:text-white/58 dark:hover:border-blue/35 dark:hover:text-blue"
      >
        <Info className="size-2.5" strokeWidth={2.4} />
      </button>

      {isOpen
        ? createPortal(
            <div
              ref={popoverRef}
              role="dialog"
              aria-label="Status score guide"
              style={{ left: position.left, top: position.top }}
              onWheel={(event) => event.stopPropagation()}
              onTouchMove={(event) => event.stopPropagation()}
              className="fixed z-50 max-h-[min(22rem,calc(100vh-5rem))] w-[min(19rem,calc(100vw-1.5rem))] overflow-y-auto overscroll-contain rounded-[14px] border border-slate-200/85 bg-white/96 p-3 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.3)] backdrop-blur dark:border-white/10 dark:bg-[#0d1828]/96"
            >
              <div className="space-y-2">
                {scale.map((item) => (
                  <div
                    key={item.range}
                    className="border-b border-slate-200/75 pb-2 last:border-b-0 last:pb-0 dark:border-white/8"
                  >
                    <p className="text-[10px] font-medium text-foreground/82">
                      {item.range} · {item.label}
                    </p>
                    <p className="mt-1 text-[9px] leading-4 text-foreground/58">
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
