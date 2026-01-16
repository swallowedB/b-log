import PostCard, {
  PostCardProps,
} from "@/app/(layout)/(shell)/_components/posts/PostCard";
import clsx from "clsx";

interface PostListGridProps {
  posts: PostCardProps[];
  cardSize?: "md" | "sm";
}

export default function PostListGrid({
  posts,
  cardSize = "md",
}: PostListGridProps) {
  const isSmall = cardSize === "sm";
  return (
    <section
      className={clsx(
        "md:mt-10",
        isSmall ? "gap-5" : "gap-8",
        "grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        "items-stretch justify-items-center"
      )}
    >
      {posts.map((post) => (
        <div className="w-full max-w-[400px]" key={post.href}>
          <PostCard {...post} size={cardSize} />
        </div>
      ))}
    </section>
  );
}
