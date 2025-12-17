"use client";

import clsx from "clsx";
import { Share2 } from "lucide-react";

export default function ShareButton() {
  const handleShare = () => {
    navigator.clipboard?.writeText(location.href);
  };

  return (
    <button
      onClick={handleShare}
      aria-label="공유하기"
      className="group flex flex-col items-center gap-1 cursor-pointer"
    >
      <span
        className={clsx(
          "flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
          "border-neutral-400/40 bg-neutral-100",
          "group-hover:border-blue-400/50",
          "dark:bg-[#1f2441]/10 dark:border-neutral-600"
        )}
      >
        <Share2 className="h-4 w-4 text-neutral-600 group-hover:text-blue-500 dark:text-neutral-300" />
      </span>
    </button>
  );
}
