import PostSection from "@/app/(layout)/(shell)/_components/posts/PostSection";
import { MOCK_POSTS } from "@/app/(layout)/(shell)/_constants/mockPosts";
import Hero from "./_components/home/Hero";
import PostToolbar from "@/app/(layout)/(shell)/_components/posts/PostToolbar";

export default function HomePage() {
  const page = 1;
  const pageSize = 16;

  return (
    <main className="px-5 sm:px-12 lg:px-40 space-y-12 ">
      <Hero />
      <PostToolbar />
      <PostSection
        posts={MOCK_POSTS}
        totalCount={MOCK_POSTS.length}
        page={page}
        pageSize={pageSize}
      />
    </main>
  );
}
