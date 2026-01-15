import { queryPosts } from "@/lib/posts/query";
import { VelitePost } from "@/lib/posts/source";

export function getRecommendedPostsForPost(
  post: VelitePost,
  limit = 3
): VelitePost[] {
  if (!post.series) return [];

  const { posts } = queryPosts({
    series: post.series,
    sort: "popular",
    page: 1,
    perPage: limit + 1,
  });

  const filtered = posts.filter((p) => p.slug !== post.slug);

  return filtered.slice(0, limit);
}
