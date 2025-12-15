import PostCard from "@/components/common/posts/PostCard";
import type { PostCardProps } from "@/components/common/posts/PostCard";

interface PostListGridProps {
  posts: PostCardProps[];
}

export default function PostListGrid({ posts }: PostListGridProps) {
  return (
    <section
      className="
        mt-10
        grid gap-8
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        items-stretch
      "
    >
      {posts.map((post) => (
        <PostCard
          key={post.href}
          {...post}
        />
      ))}
    </section>
  );
}
