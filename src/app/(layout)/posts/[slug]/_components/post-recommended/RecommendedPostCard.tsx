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
        "group relative block overflow-hidden rounded-xl bg-[#f2f3f6]  transition-transform duration-200",
        "border border-gray-300",
        "hover:scale-[1.02]",
        "dark:bg-[#050a2a] dark:border-white/20"
      )}
    >
      <div className="flex gap-3 py-4 px-3.5">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted/20">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-300 dark:bg-background/50" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className={clsx(
              "text-sm font-semibold text-neutral-900 transition-colors",
              "group-hover:text-neutral-950",
              "dark:text-foreground/70",
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

      <div className="pointer-events-none absolute -top-24 -right-24 hidden h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl dark:block" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 hidden h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl dark:block" />
    </a>
  );
}
