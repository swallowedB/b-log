import { fetchPopularRankPage } from "@/lib/supabase/postLikes";
import { getAllPosts } from "./queries";
import type { VelitePost } from "./source";
import {
  getPageRange,
  paginate,
  sortPosts,
  type PaginatedResult,
  type PostSort,
} from "./utils";

export interface QueryPostsParams {
  category?: string;
  series?: string;
  tag?: string;

  sort?: PostSort;
  page?: number;
  perPage?: number;

  includeDrafts?: boolean;

  visiblePages?: number;
}

export interface QueryPostsResult {
  posts: VelitePost[];

  totalFiltered: number;

  pagination: PaginatedResult<VelitePost>;

  pageRange: number[];

  applied: Required<
    Pick<
      QueryPostsParams,
      "sort" | "page" | "perPage" | "includeDrafts" | "visiblePages"
    >
  > & {
    category?: string;
    series?: string;
    tag?: string;
  };
}

const POPULAR_CANDIDATE_MULTIPLIER = 10;

export async function queryPosts(
  params: QueryPostsParams = {},
): Promise<QueryPostsResult> {
  const {
    category,
    series,
    tag,
    sort = "latest",
    page = 1,
    perPage = 10,
    includeDrafts = false,
    visiblePages = 5,
  } = params;

  let pool = getAllPosts({ includeDrafts });

  if (category) {
    pool = pool.filter((p) => p.category === category);
  }
  if (series) {
    pool = pool.filter((p) => p.series === series);
  }
  if (tag) {
    pool = pool.filter((p) => p.tags?.includes(tag));
  }

  if (sort === "popular") {
    const safePage = Math.max(1, Math.floor(page));
    const safePerPage = Math.max(1, Math.floor(perPage));

    const candidateLimit = safePerPage * POPULAR_CANDIDATE_MULTIPLIER;
    const candidateRows = await fetchPopularRankPage(candidateLimit, 0);

    const rankedIds = candidateRows.map((r) => r.post_id);
    const rankIndex = new Map<string, number>(
      rankedIds.map((id, i) => [id, i]),
    );

    const likedSorted = pool
      .filter((p) => rankIndex.has(p.slug))
      .sort((a, b) => rankIndex.get(a.slug)! - rankIndex.get(b.slug)!);

    const zeroLikeSorted = sortPosts(
      pool.filter((p) => !rankIndex.has(p.slug)),
      "latest",
    );

    const merged = [...likedSorted, ...zeroLikeSorted];

    const pagination = paginate(merged, {
      page: safePage,
      perPage: safePerPage,
    });
    const pageRange = getPageRange(
      pagination.page,
      pagination.totalPages,
      visiblePages,
    );

    return {
      posts: pagination.items,
      totalFiltered: merged.length,
      pagination,
      pageRange,
      applied: {
        category,
        series,
        tag,
        sort,
        page: pagination.page,
        perPage: pagination.perPage,
        includeDrafts,
        visiblePages,
      },
    };
  }

  const sorted = sortPosts(pool, sort);
  const pagination = paginate(sorted, { page, perPage });
  const pageRange = getPageRange(
    pagination.page,
    pagination.totalPages,
    visiblePages,
  );

  return {
    posts: pagination.items,
    totalFiltered: sorted.length,
    pagination,
    pageRange,
    applied: {
      category,
      series,
      tag,
      sort,
      page: pagination.page,
      perPage: pagination.perPage,
      includeDrafts,
      visiblePages,
    },
  };
}
