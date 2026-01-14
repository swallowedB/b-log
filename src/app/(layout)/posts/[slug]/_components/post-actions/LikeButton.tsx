"use client";

import { usePostLike } from "@/hooks/usePostLike";
import clsx from "clsx";
import { Heart } from "lucide-react";
import { useState } from "react";

interface PostLikeButtonProps {
  postId: string; 
}

export default function LikeButton({ postId }: PostLikeButtonProps) {
  const { count, liked, loading, toggleLike } = usePostLike(postId);

  const [isPopping, setIsPopping] = useState(false);

  const handleClick = async () => {
    await toggleLike();
    setIsPopping(true);
    window.setTimeout(() => setIsPopping(false), 180);
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleClick}
      aria-pressed={liked}
      className="group flex flex-col items-center gap-1 cursor-pointer"
    >
      <span
        className={clsx(
          "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
          "border-neutral-400/40 bg-background ",
          "group-hover:border-accent/50",
          "dark:bg-[#1f2441]/10 dark:border-neutral-600",
          liked && "border-accent dark:bg-accent/10"
        )}
      >
        <Heart
          className={clsx(
            "h-4 w-4 transition-colors",
            "motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out",
            isPopping && "scale-125",
            liked
              ? "fill-accent text-accent"
              : "text-neutral-600 group-hover:text-accent dark:text-neutral-300"
          )}
        />
      </span>

      <span className="text-[10px] font-medium text-neutral-700 dark:text-neutral-300">
        {count}
      </span>
    </button>
  );
}
