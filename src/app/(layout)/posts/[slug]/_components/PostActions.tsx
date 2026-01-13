import LikeButton from "@/app/(layout)/posts/[slug]/_components/post-actions/LikeButton";
import ShareButton from "@/app/(layout)/posts/[slug]/_components/post-actions/ShareButton";

interface PostActionsProps {
  variant?: "desktop" | "mobile";
  title: string;
  thumbnail?: string;
}

export default function PostActions({
  variant = "desktop",
  title,
  thumbnail,
}: PostActionsProps) {
  if (variant === "mobile") {
    return (
      <aside className="flex gap-2">
        <LikeButton />
        <ShareButton title={title} thumbnail={thumbnail} />
      </aside>
    );
  }

  return (
    <aside>
      <div className="flex flex-col items-center gap-3 rounded-full bg-neutral-200/50 px-2 py-3 dark:bg-[#1f2441] border border-gray-400/20 dark:border-white/20">
        <ShareButton title={title} thumbnail={thumbnail} />
        <LikeButton />
      </div>
    </aside>
  );
}
