import RecommendedPostCard, {
  RecommendedPost,
} from "@/app/(layout)/posts/[slug]/_components/post-recommended/RecommendedPostCard";
import { getRecommendedPostsForPost, VelitePost } from "@/lib/posts";

export default async function RecommendedPosts({ post }: { post: VelitePost }) {
  const recommended = await getRecommendedPostsForPost(post, 3);
  if (!recommended.length) return null;

  const items: RecommendedPost[] = recommended.map((p) => ({
    title: p.title,
    overview: p.summary ?? "",
    href: `/posts/${p.slug}`,
    thumbnail: p.thumbnail,
  }));

  return (
    <section className="space-y-3">
      <h2 className="mb-1.5 pl-1 text-sm font-semibold text-foreground/60 dark:text-neutral-100">
        추천 포스트
      </h2>

      <div className="space-y-3">
        {items.map((post) => (
          <RecommendedPostCard key={post.title} post={post} />
        ))}
      </div>
    </section>
  );
}
