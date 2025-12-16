import PostSection from "@/app/(shell)/_components/posts/PostSection";
import Hero from "./_components/home/Hero";
import { MOCK_POSTS } from "@/app/(shell)/_constants/mockPosts";

export default function HomePage() {
  const page = 1;
  const pageSize = 16;

  return (
    <main className="px-5 sm:px-12 lg:px-40 space-y-12 ">
      <Hero />
      <PostSection
        posts={MOCK_POSTS}
        totalCount={MOCK_POSTS.length}
        page={page}
        pageSize={pageSize}
      />
    </main>
  );
}
