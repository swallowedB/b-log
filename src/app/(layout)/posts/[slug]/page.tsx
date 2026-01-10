import PostActions from "@/app/(layout)/posts/[slug]/_components/PostActions";
import PostComments from "@/app/(layout)/posts/[slug]/_components/PostComments";
import PostContent from "@/app/(layout)/posts/[slug]/_components/PostContent";
import PostHeader from "@/app/(layout)/posts/[slug]/_components/PostHeader";
import PostTags from "@/app/(layout)/posts/[slug]/_components/PostTags";
import PostToc from "@/app/(layout)/posts/[slug]/_components/PostToc";
import RecommendedPosts from "@/app/(layout)/posts/[slug]/_components/RecommendedPosts";
import { notFound } from "next/navigation";
import { posts } from "../../../../../.velite";
import { adaptVeliteToc } from "@/lib/mdx/toc";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = posts.find((p) => p.slug === slug);
  if (!post) return notFound();

  return (
    <main className="mx-auto w-full max-w-7xl px-4">
      <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-[0.2fr_5fr_2.3fr]">
        <div className="hidden lg:block" />
        <section className="min-w-0">
          <PostHeader post={post} />
          <div className="my-5 border-b border-foreground/30" />
        </section>
        <div className="hidden lg:block" />

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <PostActions />
          </div>
        </aside>

        <section className="min-w-0">
          <PostTags tags={post.tags} />
          <PostContent content={post.code} />
          <PostComments />
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-10">
            <PostToc items={adaptVeliteToc(post.toc)} />
            <RecommendedPosts />
          </div>
        </aside>
      </div>

      <div className="mt-10 lg:hidden">
        <RecommendedPosts />
      </div>
    </main>
  );
}
