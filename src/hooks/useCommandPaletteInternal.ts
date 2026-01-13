import { CommandItem } from "@/components/common/CommandPalette";
import { getAllPosts } from "@/lib/posts";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type UseCommandPaletteResult = {
  open: boolean;
  query: string;
  items: CommandItem[];
  filteredItems: CommandItem[];
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
  setQuery: (v: string) => void;
  handleSelect: (item: CommandItem) => void;
  handleOpenChange: (next: boolean) => void;
};

const STATIC_ITEMS: CommandItem[] = [
  { id: "home", label: "홈", hint: "홈 화면으로 이동합니다.", href: "/" },
  {
    id: "Dev-log",
    label: "개발 로그",
    hint: "프로젝트 진행 중의 엔지니어링 히스토리를 기록한 공간입니다.",
    href: "/dev-log",
  },
  {
    id: "Insight",
    label: "Tech Notes",
    hint: "기술 개념과 인사이트를 정리해둔 아카이브입니다.",
    href: "/insight",
  },
  {
    id: "Journal",
    label: "회고/저널",
    hint: "지나온 경험을 정리하고 방향성을 고민하는 개인 저널입니다.",
    href: "/journal",
  },
];

function buildPostItems(): CommandItem[] {
  const posts = getAllPosts({ includeDrafts: false });

  return posts.map((post) => {
    const tagsText = post.tags?.join(" ") ?? "";
    const categoryText = post.category ?? "";
    const seriesText = post.series ?? "";
    const summaryText = post.summary ?? "";
    const slugText = post.slug ?? "";

    const searchableText = [
      post.title,
      summaryText,
      tagsText,
      categoryText,
      seriesText,
      slugText,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return {
      id: `post-${post.slug}`,
      label: post.title,
      hint:
        summaryText ||
        `${categoryText} · ${seriesText || ""} ${tagsText || ""}`.trim(),
      href: `/posts/${post.slug}`,
      searchableText,
    };
  });
}

export default function useCommandPaletteInternal(): UseCommandPaletteResult {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const items = useMemo<CommandItem[]>(() => {
    const postItems = buildPostItems();
    return [...STATIC_ITEMS, ...postItems];
  }, []);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) => {
      const target = (
        item.label +
        " " +
        (item.hint ?? "") +
        " " +
        (item.searchableText ?? "")
      )
        .toLowerCase()
        .trim();

      return target.includes(q);
    });
  }, [items, query]);

  const openPalette = useCallback(() => {
    setQuery("");
    setOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const togglePalette = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        setQuery("");
      }
      return next;
    });
  }, []);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      if (item.href) {
        router.push(item.href);
      }
      setOpen(false);
      setQuery("");
    },
    [router]
  );

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const meta = isMac ? e.metaKey : e.ctrlKey;

      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        togglePalette();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [togglePalette]);

  return {
    open,
    query,
    items,
    filteredItems,
    openPalette,
    closePalette,
    togglePalette,
    setQuery,
    handleSelect,
    handleOpenChange,
  };
}