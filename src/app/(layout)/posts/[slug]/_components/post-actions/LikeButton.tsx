"use client";

import clsx from "clsx";
import { Heart } from "lucide-react";
import { useState } from "react";

export default function LikeButton() {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount] = useState(0);
  const [isPopping, setIsPopping] = useState(false);

  const handleClick = () => {
    setIsLiked((v) => !v);

    setIsPopping(true);
    window.setTimeout(() => setIsPopping(false), 180);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="좋아요"
      className="group flex flex-col items-center gap-1 cursor-pointer"
    >
      <span
        className={clsx(
          "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
          "border-neutral-400/40 bg-neutral-100",
          "group-hover:border-accent/50",
          "dark:bg-[#1f2441]/10 dark:border-neutral-600",
          isLiked && "border-accent dark:bg-accent/10"
        )}
      >
        <Heart
          className={clsx(
            "h-4 w-4 transition-colors",
            "motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out",
            isPopping && "scale-125",
            isLiked
              ? "fill-accent text-accent"
              : "text-neutral-600 group-hover:text-accent dark:text-neutral-300",
          )}
        />
      </span>

      <span className="text-[10px] font-medium text-neutral-700 dark:text-neutral-300">
        {likeCount}
      </span>
    </button>
  );
}
