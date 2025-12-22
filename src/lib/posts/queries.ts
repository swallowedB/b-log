import { velitePosts, type VelitePost } from "./source";

export interface GetAllPostsOptions {
  includeDrafts?: boolean; 
}

export function getAllPosts(options: GetAllPostsOptions = {}): VelitePost[] {
  const { includeDrafts = false } = options;

  const filtered = includeDrafts
    ? velitePosts
    : velitePosts.filter((post) => post.draft === false);

  return [...filtered];
}
