"use client";

import { TocItem } from "@/lib/mdx/toc";
import { useEffect, useState } from "react";

interface UsePostTocParams {
  items: TocItem[];
  headerOffset?: number;
}

export function usePostToc({ items, headerOffset = 80 }: UsePostTocParams) {
  const [activeId, setActiveId] = useState<string | null>(
    items[0]?.id ?? null,
  );

  const handleItemClick = (
    id: string,
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();

    const el = document.getElementById(id);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top - headerOffset;

    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top, behavior: "smooth" });

    setActiveId(id);
  };

  useEffect(() => {
    if (!items.length) return;
    if (typeof window === "undefined") return;

    const headings = items
      .map((it) => document.getElementById(it.id))
      .filter(Boolean) as HTMLElement[];

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop,
          );

        if (!visible[0]) return;

        const id = (visible[0].target as HTMLElement).id;
        setActiveId((prev) => (prev === id ? prev : id));
      },
      {
        root: null,
        rootMargin: `-${headerOffset}px 0px -60% 0px`,
        threshold: 0,
      },
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items, headerOffset]);

  return {
    toc: items,
    activeId,
    handleItemClick,
  };
}
