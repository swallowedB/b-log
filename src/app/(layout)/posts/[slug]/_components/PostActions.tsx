import LikeButton from "@/app/(layout)/posts/[slug]/_components/post-actions/LikeButton";
import ShareButton from "@/app/(layout)/posts/[slug]/_components/post-actions/ShareButton";

interface PostActionsProps {
  variant?: "desktop" | "mobile";
}

export default function PostActions({ variant = "desktop" }: PostActionsProps) {
  if (variant === "mobile") {
    return (
      <aside className="flex gap-2">
        <LikeButton />
        <ShareButton />
      </aside>
    );
  }

  return (
    <aside className="sticky top-28 z-50 ">
      <div className="flex flex-col items-center gap-3 rounded-full bg-neutral-200/50 px-2 py-3 dark:bg-[#1f2441] border border-gray-400/20 dark:border-white/20">
        <ShareButton />
        <LikeButton />
      </div>
    </aside>
  );
}
