import type { PostCardProps } from "@/app/(layout)/(shell)/_components/posts/PostCard";
import PostCard from "@/app/(layout)/(shell)/_components/posts/PostCard";

interface PostListGridProps {
  posts: PostCardProps[];
  cardSize?: "md" | "sm";
}

export default function PostListGrid({
  posts,
  cardSize = "md",
}: PostListGridProps) {
  return (
    <section
      className="
        md:mt-10
        grid gap-8
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        items-stretch
        justify-items-center
      "
    >
      {posts.map((post) => (
        <div className="w-full max-w-[400px]" key={post.href}>
          <PostCard {...post} size={cardSize} />
        </div>
      ))}
    </section>
  );
}
