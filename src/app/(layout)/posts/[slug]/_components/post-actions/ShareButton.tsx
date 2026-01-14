"use client";

import { useShare } from "@/hooks/useShare";
import clsx from "clsx";
import { Share2 } from "lucide-react";

type ShareButtonProps = {
  title: string;
  thumbnail?: string;
};

export default function ShareButton({ title, thumbnail }: ShareButtonProps) {
  const imageUrl = thumbnail ?? "/post-fallback.png";

  const { share } = useShare({
    title,
    imageUrl,
  });

  const handleClick = async () => {
    const result = await share();

    if (result.ok) {
      if (result.method === "clipboard") {
        console.log("링크가 복사되었습니다.");
      }
    } else {
      if (result.aborted) return;
      console.error("🚨 공유하기 실패:", result.error);
    }
  };
  return (
    <button
      onClick={handleClick}
      aria-label="공유하기"
      className="group flex flex-col items-center gap-1 cursor-pointer"
    >
      <span
        className={clsx(
          "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
          "border-neutral-400/40 bg-background",
          "group-hover:border-blue-400/50",
          "dark:bg-[#1f2441]/10 dark:border-neutral-600"
        )}
      >
        <Share2 className="h-3.5 w-3.5 mr-0.5 text-neutral-600 group-hover:text-blue-500 dark:text-neutral-300" />
      </span>
    </button>
  );
}
