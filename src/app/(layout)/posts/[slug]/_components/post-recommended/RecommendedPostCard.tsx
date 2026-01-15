import clsx from "clsx";
import Image from "next/image";

export type RecommendedPost = {
  title: string;
  overview: string;
  href: string;
  thumbnail?: string;
};
export default function RecommendedPostCard({
  post,
}: {
  post: RecommendedPost;
}) {
  return (
    <a
      href={post.href}
      className={clsx(
        "group relative block overflow-hidden rounded-xl bg-[#f2f3f6] transition-transform duration-200",
        "min-w-55",
        "border border-gray-300",
        "hover:scale-[1.02]",
        "dark:bg-[#050a2a] dark:border-white/20"
      )}
    >
      <div className="flex gap-2.5 p-3">
        <div className="shrink-0 overflow-hidden rounded-lg bg-muted/20">
          <Image
            src={post.thumbnail ?? "/post-fallback.png"}
            alt={post.title}
            width={64}
            height={64}
            className="h-16 w-16 object-cover object-center"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div
            className={clsx(
              "text-sm font-semibold text-neutral-900 transition-colors",
              "group-hover:text-neutral-950",
              "dark:text-foreground/90",
              "line-clamp-1"
            )}
          >
            {post.title}
          </div>

          <p className="mt-2 line-clamp-2 text-xs text-neutral-500 dark:text-foreground/40">
            {post.overview}
          </p>
        </div>
      </div>
    </a>
  );
}
