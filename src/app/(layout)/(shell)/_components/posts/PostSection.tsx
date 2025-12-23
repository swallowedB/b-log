import PostListGrid from "@/app/(layout)/(shell)/_components/posts/PostListGrid";
import PaginationClient from "@/components/common/pagination/PaginationClient";
import { PaginatedResult, toPostCardModel, VelitePost } from "@/lib/posts";

interface PostSectionProps {
  posts: VelitePost[];
  pagination: PaginatedResult<VelitePost>;
  pageRange: number[];
  cardSize?: "md" | "sm";
}

export default function PostSection({
  posts,
  pagination,
  pageRange,
  cardSize = "md",
}: PostSectionProps) {
  const cardPosts = posts.map(toPostCardModel);

  return (
    <section className="space-y-6 md:space-y-8">
      <PostListGrid posts={cardPosts} cardSize={cardSize} />

      <div className="flex justify-center pt-4">
        <PaginationClient
          pagination={pagination}
          pageRange={pageRange}
        />
      </div>
    </section>
  );
}
