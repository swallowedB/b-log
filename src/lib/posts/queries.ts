import { CategoryKey } from "@/config/categories";
import { SERIES_META_BY_CATEGORY } from "@/lib/posts/registry/series.registry";
import { velitePosts, type VelitePost } from "./source";
import { SeriesMeta } from "@/lib/posts/registry/series.types";

export interface PostQueryOptions {
  includeDrafts?: boolean;
}
export function getAllPosts(options: PostQueryOptions = {}): VelitePost[] {
  const { includeDrafts = false } = options;

  const filtered = includeDrafts
    ? velitePosts
    : velitePosts.filter((post) => post.draft !== true);

  return [...filtered];
}

export function getPostBySlug(
  slug: string,
  options: PostQueryOptions = {}
): VelitePost | null {
  const { includeDrafts = false } = options;

  const pool = includeDrafts ? velitePosts : getAllPosts();
  const found = pool.find((post) => post.slug === slug);

  return found ?? null;
}

export function getPostsByCategory(
  category: string,
  options: PostQueryOptions = {}
): VelitePost[] {
  const { includeDrafts = false } = options;

  const pool = includeDrafts ? velitePosts : getAllPosts();
  return pool.filter((post) => post.category === category);
}

export function getPostsByTag(
  tag: string,
  options: PostQueryOptions = {}
): VelitePost[] {
  const { includeDrafts = false } = options;

  const pool = includeDrafts ? velitePosts : getAllPosts();
  return pool.filter((post) => post.tags?.includes(tag));
}

export function getSeriesMeta(
  seriesId: string,
  category?: CategoryKey
): SeriesMeta | null {
  if (category) {
    const list = SERIES_META_BY_CATEGORY[category] ?? [];
    return list.find((s) => s.id === seriesId) ?? null;
  }

  for (const list of Object.values(SERIES_META_BY_CATEGORY)) {
    const found = list.find((s) => s.id === seriesId);
    if (found) return found;
  }

  return null;
}

export function getSeriesListByCategory(category: CategoryKey) {
  return SERIES_META_BY_CATEGORY[category] ?? [];
}
