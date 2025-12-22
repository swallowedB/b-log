import type { VelitePost } from "./source";
import { getAllPosts } from "./queries";
import { sortPosts, type PostSort, paginate, type PaginatedResult, getPageRange } from "./utils";

export interface QueryPostsParams {
  category?: string;
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
    tag?: string;
  };
}

export function queryPosts(params: QueryPostsParams = {}): QueryPostsResult {
  const {
    category,
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
  if (tag) {
    pool = pool.filter((p) => p.tags?.includes(tag));
  }

  const sorted = sortPosts(pool, sort);

  const pagination = paginate(sorted, { page, perPage });

  const pageRange = getPageRange(pagination.page, pagination.totalPages, visiblePages);

  return {
    posts: pagination.items,
    totalFiltered: sorted.length,
    pagination,
    pageRange,
    applied: {
      category,
      tag,
      sort,
      page: pagination.page,
      perPage: pagination.perPage,
      includeDrafts,
      visiblePages,
    },
  };
}
