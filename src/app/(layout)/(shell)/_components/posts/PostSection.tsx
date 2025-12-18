import { PostCardProps } from "@/app/(layout)/(shell)/_components/posts/PostCard";
import PostListGrid from "@/app/(layout)/(shell)/_components/posts/PostListGrid";
import Pagination from "@/components/common/pagination/Pagination";

interface PostSectionProps {
  posts: PostCardProps[];
  totalCount: number;
  page: number;
  pageSize: number;
  cardSize?: "md" | "sm";
}

export default function PostSection({
  posts,
  totalCount,
  page,
  pageSize,
  cardSize = "md",
}: PostSectionProps) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const pagedPosts = posts.slice(start, end);

  return (
    <section className="space-y-6 md:space-y-8">
      <PostListGrid posts={pagedPosts} cardSize={cardSize} />

      <div className="flex justify-center pt-4">
        <Pagination totalCount={totalCount} page={page} pageSize={pageSize} />
      </div>
    </section>
  );
}
