import { CommandItem } from "@/components/common/CommandPalette";
import { getAllPosts } from "@/lib/posts";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type UseCommandPaletteResult = {
  open: boolean;
  query: string;
  displayItems: CommandItem[];
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

function isPostItem(item: CommandItem) {
  return (
    item.id.startsWith("post-") || (item.href?.startsWith("/posts/") ?? false)
  );
}

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

const RECENT_KEY = "b_log_cmdk_recent";
const RECENT_LIMIT = 3;

function readRecent(): CommandItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(RECENT_KEY);
    const parsed = raw ? (JSON.parse(raw) as CommandItem[]) : [];
    return Array.isArray(parsed) ? parsed.slice(0, RECENT_LIMIT) : [];
  } catch {
    return [];
  }
}

function writeRecent(items: CommandItem[]) {
  sessionStorage.setItem(
    RECENT_KEY,
    JSON.stringify(items.slice(0, RECENT_LIMIT)),
  );
}

function pushRecent(item: CommandItem): CommandItem[] {
  const current = readRecent();
  const next = [item, ...current.filter((x) => x.id !== item.id)].slice(
    0,
    RECENT_LIMIT,
  );
  writeRecent(next);
  return next;
}

export default function useCommandPaletteInternal(): UseCommandPaletteResult {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recentItems, setRecentItems] = useState<CommandItem[]>(() =>
    readRecent(),
  );

  const items = useMemo<CommandItem[]>(() => {
    const postItems = buildPostItems();
    return [...STATIC_ITEMS, ...postItems];
  }, []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

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

  const displayItems = useMemo<CommandItem[]>(() => {
    const q = query.trim();
    if (q.length > 0) return searchResults;

    if (recentItems.length === 0) return STATIC_ITEMS;
    return [...STATIC_ITEMS, ...recentItems];
  }, [query, recentItems, searchResults]);

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
      if (isPostItem(item)) {
        setRecentItems(pushRecent(item));
      }
      if (item.href) {
        router.push(item.href);
      }
      setOpen(false);
      setQuery("");
    },
    [router],
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
    displayItems,
    openPalette,
    closePalette,
    togglePalette,
    setQuery,
    handleSelect,
    handleOpenChange,
  };
}
