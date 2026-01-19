import { velitePosts } from "@/lib/posts";
import Link from "next/link";

type Props = {
  slug: string;
};

export default function PostMention({ slug }: Props) {
  const post = velitePosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <span className="inline-flex items-center rounded-full border border-red-300 px-2 py-0.5 text-xs text-red-700">
        @{slug}
      </span>
    );
  }

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
    >
      <span className="font-medium">{post.title}</span>
      <span className="text-[10px] text-neutral-500">
        {post.category} · {post.date}
      </span>
    </Link>
  );
}
