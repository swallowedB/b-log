import PostActions from "@/app/(layout)/posts/[slug]/_components/PostActions";
import PostComments from "@/app/(layout)/posts/[slug]/_components/PostComments";
import PostContent from "@/app/(layout)/posts/[slug]/_components/PostContent";
import PostHeader from "@/app/(layout)/posts/[slug]/_components/PostHeader";
import PostTags from "@/app/(layout)/posts/[slug]/_components/PostTags";
import PostToc from "@/app/(layout)/posts/[slug]/_components/PostToc";
import RecommendedPosts from "@/app/(layout)/posts/[slug]/_components/RecommendedPosts";
import { post, toc } from "@/app/(layout)/posts/_constants/mockPost";

export default function PostPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4">
      <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-[0.5fr_5fr_2.3fr]">
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
          <PostContent />
          <PostComments />
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-10">
            <PostToc items={toc} />
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
