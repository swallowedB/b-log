import { queryPosts } from "@/lib/posts/query";
import { VelitePost } from "@/lib/posts/source";

export async function getRecommendedPostsForPost(
  post: VelitePost,
  limit = 3
): Promise<VelitePost[]>  {
  if (!post.series) return [];

  const { posts } = await queryPosts({
    series: post.series,
    sort: "popular",
    page: 1,
    perPage: limit + 1,
  });

  if (!posts || !posts.length) return [];

  const filtered = posts.filter((p) => p.slug !== post.slug);

  return filtered.slice(0, limit);
}
