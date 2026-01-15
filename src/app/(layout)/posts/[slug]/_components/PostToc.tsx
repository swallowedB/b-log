"use client";

import { usePostToc } from "@/app/(layout)/posts/_hooks/usePostToc";
import { TocItem } from "@/lib/mdx/toc";
import clsx from "clsx";

export default function PostToc({ items }: { items: TocItem[] }) {
  const { activeId, handleItemClick } = usePostToc({
    items,
    headerOffset: 80,
  });

  return (
    <>
      <nav className="relative">
        <span className="pointer-events-none absolute left-0 top-0 h-full w-px bg-neutral-200 dark:bg-neutral-700" />

        <div className="space-y-0.5">
          {items.map((it) => {
            const isActive = activeId === it.id;

            return (
              <a
                key={it.id}
                href={`#${it.id}`}
                onClick={(e) => handleItemClick(it.id, e)}
                className={clsx(
                  "group relative block rounded-md py-1.5 pr-2 text-sm transition-colors",
                  "pl-4",
                  isActive
                    ? "text-gray-900 dark:text-blue-300 font-semibold"
                    : "text-neutral-400 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-blue-300"
                )}
              >
                {/* 왼쪽 강조 라인 */}
                <span
                  aria-hidden="true"
                  className={clsx(
                    "pointer-events-none absolute inset-y-0 left-0 w-0.5 rounded-full bg-gray-300 dark:bg-blue-400 transition-opacity",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                />

                {/* 배경 하이라이트 */}
                <span
                  aria-hidden="true"
                  className={clsx(
                    "pointer-events-none absolute inset-0 rounded-md transition-colors",
                  "bg-transparent group-hover:bg-gray-500/5 dark:group-hover:bg-white/5"
                  )}
                />

                <span className="relative block truncate">{it.text}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
