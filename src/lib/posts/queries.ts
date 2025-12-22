import { velitePosts, type VelitePost } from "./source";

export interface GetAllPostsOptions {
  includeDrafts?: boolean; 
}

export interface GetPostBySlugOptions {
  includeDrafts?: boolean; 
}

export interface GetPostsByCategoryOptions {
  includeDrafts?: boolean;
}

export interface GetPostsByTagOptions {
  includeDrafts?: boolean; 
}

export function getAllPosts(options: GetAllPostsOptions = {}): VelitePost[] {
  const { includeDrafts = false } = options;

  const filtered = includeDrafts
    ? velitePosts
    : velitePosts.filter((post) => post.draft === false);

  return [...filtered];
}

export function getPostBySlug(
  slug: string,
  options: GetPostBySlugOptions = {}
): VelitePost | null {
  const { includeDrafts = false } = options;

  const pool = includeDrafts ? velitePosts : getAllPosts();
  const found = pool.find((post) => post.slug === slug);

  return found ?? null;
}

export function getPostsByCategory(
  category: string,
  options: GetPostsByCategoryOptions = {}
): VelitePost[] {
  const { includeDrafts = false } = options;

  const pool = includeDrafts ? velitePosts : getAllPosts();
  return pool.filter((post) => post.category === category);
}

export function getPostsByTag(
  tag: string,
  options: GetPostsByTagOptions = {}
): VelitePost[] {
  const { includeDrafts = false } = options;

  const pool = includeDrafts ? velitePosts : getAllPosts();
  return pool.filter((post) => post.tags?.includes(tag));
}