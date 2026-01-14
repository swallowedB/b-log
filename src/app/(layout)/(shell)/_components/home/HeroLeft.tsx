"use client";

import { useCommandPalette } from "@/components/common/CommandPalette";
import clsx from "clsx";
import { Search } from "lucide-react";

interface HeroLeftProps {
  intro: string;
}

export default function HeroLeft({ intro }: HeroLeftProps) {
  const { openPalette } = useCommandPalette();

  return (
    <div className="flex-1 space-y-12">
      <div className="space-y-3">
        <h1 className="text-xl font-black  md:text-[40px]">
          Like the Boa That
          <br />
          Swallowed an Elephant
        </h1>
        <p className="text-xs text-foreground/50 md:text-sm font-light whitespace-pre-line">
          {intro}
        </p>
      </div>

      <div className="pr-2 -ml-0.5 w-full ">
        <button
          type="button"
          onClick={openPalette}
          className={clsx(
            "cursor-pointer",
            "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 shadow-sm backdrop-blur-sm transition",
            "bg-white/60 text-neutral-700 border border-neutral-200 hover:bg-white/80 hover:border-neutral-300/80",
            "dark:bg-white/10 dark:text-white/60 dark:border-white/20 dark:hover:bg-white/20 dark:hover:border-white/40"
          )}
        >
          <Search
            className={clsx(
              "h-5 w-5 transition",
              "text-neutral-500 group-hover:text-neutral-800",
              "dark:text-white/80 dark:group-hover:text-white"
            )}
          />

          <span
            className={clsx(
              "flex-1 text-left text-sm transition",
              "text-neutral-400 group-hover:text-neutral-900",
              "dark:text-white/60 dark:group-hover:text-white"
            )}
          >
            삼킨 것들은 지금 무엇이 되었을까요?
          </span>

          <span
            className={clsx(
              "rounded-md px-2 py-0.5 text-[10px] transition font-semibold",
              "bg-neutral-300/50 text-neutral-500",
              "dark:bg-white/20 dark:text-white"
            )}
          >
            ⌘K
          </span>
        </button>
      </div>
    </div>
  );
}
