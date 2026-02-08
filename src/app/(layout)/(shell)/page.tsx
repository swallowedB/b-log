import PostSection from "@/app/(layout)/(shell)/_components/posts/PostSection";
import PostToolbar from "@/app/(layout)/(shell)/_components/posts/PostToolbar";
import Hero from "./_components/home/Hero";

import { getAllTags, parsePostSearchParams, queryPosts } from "@/lib/posts";
import { SearchParams } from "@/types/route.types";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const params = parsePostSearchParams(resolvedSearchParams, {
    perPage: 16,
    sort: "latest",
    visiblePages: 5,
  });

  const tags = getAllTags(false);

  const { posts, pagination, pageRange, applied } = await queryPosts(params);

  return (
    <main className="px-5 sm:px-12 lg:px-35 space-y-12 ">
      <Hero />
      <PostToolbar sort={applied.sort} tags={tags} />
      <PostSection
        posts={posts}
        pagination={pagination}
        pageRange={pageRange}
      />
    </main>
  );
}
