import type { VelitePost } from "./source";
import { getAllPosts } from "./queries";
import { sortPosts, type PostSort, paginate, type PaginatedResult, getPageRange } from "./utils";
import { getLikeCountsForPosts } from "@/lib/supabase/postLikes";

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

  applied: Required<Pick<QueryPostsParams, "sort" | "page" | "perPage" | "includeDrafts" | "visiblePages">> & {
    category?: string;
    series?: string;
    tag?: string;
  };
}

export async function queryPosts(params: QueryPostsParams = {}): Promise<QueryPostsResult> {
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

  let sorted: VelitePost[];

  if (sort === "popular") {
    const ids = pool.map((p) => p.slug);

    const likeCounts = await getLikeCountsForPosts(ids);

    sorted = sortPosts(pool, "popular", likeCounts);
  } else {
    sorted = sortPosts(pool, sort);
  }

  const pagination = paginate(sorted, { page, perPage });

  const pageRange = getPageRange(pagination.page, pagination.totalPages, visiblePages);

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
