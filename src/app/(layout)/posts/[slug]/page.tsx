import PostActions from "@/app/(layout)/posts/[slug]/_components/PostActions";
import PostComments from "@/app/(layout)/posts/[slug]/_components/PostComments";
import PostContent from "@/app/(layout)/posts/[slug]/_components/PostContent";
import PostHeader from "@/app/(layout)/posts/[slug]/_components/PostHeader";
import PostTags from "@/app/(layout)/posts/[slug]/_components/PostTags";
import PostToc from "@/app/(layout)/posts/[slug]/_components/PostToc";
import RecommendedPosts from "@/app/(layout)/posts/[slug]/_components/RecommendedPosts";
import { adaptVeliteToc } from "@/lib/mdx/toc";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { velitePosts } from "@/lib/posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = velitePosts.find((p) => p.slug === slug);
  if (!post) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://b0o0a.com";
  const url = `${baseUrl}/posts/${post.slug}`;
  const ogImage = post.thumbnail
    ? `${baseUrl}${post.thumbnail}`
    : `${baseUrl}/post-fallback.png`;

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.summary,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [ogImage],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = velitePosts.find((p) => p.slug === slug);
  if (!post) return notFound();

  return (
    <main className="mx-auto w-full max-w-7xl">
      <div className="grid grid-cols-1 gap-x-9 xl:grid-cols-[0.1fr_3fr_0.4fr]">
        <div className="hidden xl:block" />
        <section className="min-w-0">
          <PostHeader post={post} />
          <div className="my-5 border-b border-foreground/20" />
        </section>
        <div className="hidden xl:block" />
        {/* <PostThumbnail thumbnail={post.thumbnail} title={post.title} /> */}

        <aside className="hidden xl:block">
          <div className="sticky top-40">
            <PostActions title={post.title} thumbnail={post.thumbnail} post={post} />
          </div>
        </aside>

        <section className="min-w-0">
          <PostTags tags={post.tags} />
          <PostContent content={post.code} />
          <PostComments />
        </section>

        <aside className="hidden xl:flex xl:flex-col">
          <div className="flex-1 max-w-55 ml-auto pb-20">
            <div className="sticky top-24">
              <PostToc items={adaptVeliteToc(post.toc)} />
            </div>
          </div>

          <div className="pt-10 max-w-55 ml-auto">
            <RecommendedPosts post={post} />
          </div>
        </aside>
      </div>

      <div className="mt-10 xl:hidden">
        <RecommendedPosts post={post}/>
      </div>
    </main>
  );
}
