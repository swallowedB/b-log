import { velitePosts, type VelitePost } from "./source";

export interface PostQueryOptions {
  includeDrafts?: boolean;
}
export function getAllPosts(options: PostQueryOptions = {}): VelitePost[] {
  const { includeDrafts = false } = options;

  const filtered = includeDrafts
    ? velitePosts
    : velitePosts.filter((post) => post.draft === false);

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