"use client";

import { TAGS, TagValue } from "@/app/(layout)/(shell)/_constants/mockTags";
import { useTagScroller } from "@/app/(layout)/(shell)/_hooks/useTagScroller";
import clsx from "clsx";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";

interface TagFilterListProps {
  value?: TagValue;
  onChange?: (value: TagValue) => void;
  className?: string;
}

export default function TagFilterList({
  value,
  onChange,
  className,
}: TagFilterListProps) {
  const [internalValue, setInternalValue] = useState<TagValue>("전체");
  const currentValue = value ?? internalValue;

  const {
    scrollRef,
    measureRef,
    visibleWidth,
    hasLeftOverflow,
    hasRightOverflow,
    slide,
  } = useTagScroller({ visibleCount: 7, overlaySpace: 56 });

  const handleTagClick = (tag: TagValue) => {
    if (tag === currentValue) return;
    if (!value) setInternalValue(tag);
    onChange?.(tag);
  };

  return (
    <>
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none -z-50"
      >
        {TAGS.slice(1).map((tag) => (
          <button
            key={`measure-${tag}`}
            className="rounded-full px-4 py-1.5 text-xs font-medium"
          >
            {tag}
          </button>
        ))}
      </div>

      <div className={clsx("flex items-center gap-3", className)}>
        <button
          type="button"
          onClick={() => handleTagClick("전체")}
          className={clsx(
            "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
            currentValue === "전체"
              ? "bg-muted text-white dark:bg-accent"
              : "bg-slate-200/80 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          )}
        >
          전체
        </button>

        <div
          className="relative flex-1 min-w-0"
          style={{ maxWidth: visibleWidth }}
        >
          <div
            ref={scrollRef}
            className={clsx(
              "flex items-center gap-2 overflow-x-auto scroll-smooth py-1",
              "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            )}
          >
            {TAGS.slice(1).map((tag) => {
              const isActive = tag === currentValue;

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className={clsx(
                    "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer",
                    isActive
                      ? "bg-muted text-white dark:bg-accent"
                      : "bg-slate-200/80 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* fades */}
          <div
            className={clsx(
              "pointer-events-none absolute left-0 top-0 h-full w-15 z-20",
              "bg-linear-to-r from-background via-background/90 to-transparent",
              "transition-opacity duration-200",
              hasLeftOverflow ? "opacity-100" : "opacity-0"
            )}
            aria-hidden="true"
          />
          <div
            className={clsx(
              "pointer-events-none absolute right-0 top-0 h-full w-15 z-20",
              "bg-linear-to-l from-background via-background/90 to-transparent",
              "transition-opacity duration-200",
              hasRightOverflow ? "opacity-100" : "opacity-0"
            )}
            aria-hidden="true"
          />

          {hasLeftOverflow && (
            <button
              type="button"
              onClick={() => slide("left")}
              aria-label="왼쪽으로 이동"
              className={clsx(
                "absolute left-1 top-1/2 -translate-y-1/2 z-30",
                "flex items-center justify-center w-7 h-7 rounded-full cursor-pointer",
                "transition-colors"
              )}
            >
              <ChevronsLeft className="w-4 h-4 text-slate-400 hover:text-slate-700 dark:text-slate-300" />
            </button>
          )}

          {hasRightOverflow && (
            <button
              type="button"
              onClick={() => slide("right")}
              aria-label="오른쪽으로 이동"
              className={clsx(
                "absolute right-1 top-1/2 -translate-y-1/2 z-30",
                "flex items-center justify-center w-7 h-7 rounded-full cursor-pointer",
                "transition-colors"
              )}
            >
              <ChevronsRight className="w-4 h-4 text-slate-400 hover:text-slate-700 dark:text-slate-300" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
