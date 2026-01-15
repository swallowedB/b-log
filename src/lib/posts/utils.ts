import { LikeCountMap } from "@/lib/supabase/postLikes";
import type { VelitePost } from "./source";

export type PostSort = "latest" | "popular";

export function sortPosts(
  posts: VelitePost[],
  sort: PostSort,
  likeCounts?: LikeCountMap,
): VelitePost[] {
  const copied = [...posts];

  if (sort === "latest") {
    copied.sort((a, b) => b.date.localeCompare(a.date));
    return copied;
  }

  if (sort === "popular") {
    copied.sort((a, b) => {
      const aLikes = likeCounts?.[a.slug] ?? 0;
      const bLikes = likeCounts?.[b.slug] ?? 0;

      if (aLikes !== bLikes) {
        return bLikes - aLikes;
      }

      return b.date.localeCompare(a.date);
    });

    return copied;
  }

  return copied;
}

export interface PaginateParams {
  page: number;
  perPage: number;
}

export interface PaginatedResult<T> {
  items: T[];

  page: number;
  perPage: number;

  totalItems: number;
  totalPages: number;

  firstPage: number;
  lastPage: number;

  prevPage: number | null;
  nextPage: number | null;

  canGoFirst: boolean;
  canGoLast: boolean;
  hasPrev: boolean;
  hasNext: boolean;
}

export function paginate<T>(
  items: T[],
  params: PaginateParams
): PaginatedResult<T> {
  const totalItems = items.length;

  const perPage = Number.isFinite(params.perPage)
    ? Math.floor(params.perPage)
    : 1;
  const safePerPage = Math.max(1, perPage);

  const totalPages = Math.max(1, Math.ceil(totalItems / safePerPage));

  const page = Number.isFinite(params.page) ? Math.floor(params.page) : 1;
  const safePage = Math.min(Math.max(1, page), totalPages);

  const start = (safePage - 1) * safePerPage;
  const end = start + safePerPage;

  const sliced = items.slice(start, end);

  const hasPrev = safePage > 1;
  const hasNext = safePage < totalPages;

  const firstPage = 1;
  const lastPage = totalPages;

  const prevPage = hasPrev ? safePage - 1 : null;
  const nextPage = hasNext ? safePage + 1 : null;

  return {
    items: sliced,

    page: safePage,
    perPage: safePerPage,

    totalItems,
    totalPages,

    firstPage,
    lastPage,

    prevPage,
    nextPage,

    canGoFirst: safePage !== firstPage,
    canGoLast: safePage !== lastPage,

    hasPrev,
    hasNext,
  };
}

export function getPageRange(
  currentPage: number,
  totalPages: number,
  visibleCount = 5
): number[] {
  if (totalPages <= 0) return [];

  const safeVisibleCount = Math.max(1, Math.floor(visibleCount));
  const half = Math.floor(safeVisibleCount / 2);

  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + safeVisibleCount - 1);

  start = Math.max(1, end - safeVisibleCount + 1);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}
