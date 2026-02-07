"use client";
import clsx from "clsx";
import { useState } from "react";

export type PostSortValue = "latest" | "popular";

interface Props {
  value?: PostSortValue;
  onChange?: (value: PostSortValue) => void;
  onPrefetch?: (value: PostSortValue) => void;
  className?: string;
}

const SORT_OPTIONS: { value: PostSortValue; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
];

export default function SortSelect({ value, onChange, onPrefetch, className }: Props) {
  const [internalValue, setInternalValue] = useState<PostSortValue>("latest");
  const currentValue = value ?? internalValue;

  const handleChange = (next: PostSortValue) => {
    if (next === currentValue) return;
    if (!value) setInternalValue(next);
    onChange?.(next);
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-2 text-[11px] sm:text-xs",
        "text-color:var(--color-foreground)",
        className
      )}
    >
      <div className="inline-flex items-center gap-0.5 rounded-full px-1 py-0.5">
        {SORT_OPTIONS.map((option) => {
          const isActive = option.value === currentValue;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange(option.value)}
              onPointerEnter={() => onPrefetch?.(option.value)}
              aria-pressed={isActive}
              className={clsx(
                "inline-flex items-center justify-center rounded-full px-1 py-1",
                "cursor-pointer",
                "text-[11px] sm:text-xs font-medium",
                "transition-colors focus-visible:outline-none focus-visible:ring-1",
                "focus-visible:ring-color:var(--color-accent)",
                isActive
                  ? "text-color:var(--color-accent) font-semibold"
                  : "text-color:var(--color-foreground) opacity-60 hover:opacity-100 hover:text-color:var(--color-muted) dark:hover:text-color:var(--color-accent)"
              )}
            >
              <span
                className={clsx(
                  "mr-1 text-[8px] leading-none transition-opacity",
                  isActive
                    ? "opacity-100 text-color:var(--color-accent)"
                    : "opacity-0"
                )}
              >
                •
              </span>

              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
