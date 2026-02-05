"use client";

import FolderIcon, { FolderTone } from "@/components/common/icons/FolderIcon";

interface SeriesFolderItemProps {
  id: string;
  name: string;
  postCount: number;
  tone: FolderTone;
  isActive?: boolean;
  onClick?: () => void;
}

export default function SeriesFolderItem({
  name,
  postCount,
  tone,
  isActive = false,
  onClick,
}: SeriesFolderItemProps) {
  return (
    <button
      type="button"
      className="group relative text-left"
      onClick={onClick}
      aria-pressed={isActive}
    >
      <div
        className="
          relative
          w-[clamp(175px,13.8vw,230px)]
          aspect-300/250
        "
      >
        <FolderIcon
          tone={tone}
          className="
            w-full h-full
            transition-transform duration-300
            group-hover:scale-[1.02]
            group-active:scale-[0.98]
          "
        />

        <div className="pointer-events-none absolute bottom-[12%] left-[10%] flex flex-col px-[10%] py-[10%]">
          <p className="text-[clamp(14px,1.2vw,18px)] font-semibold text-white tracking-wider">
            {name}
          </p>

          <div className="mt-1 flex items-baseline gap-3 text-[clamp(10px,0.9vw,12px)] text-white/60">
            <span>총 {postCount}개의 포스트</span>
          </div>
        </div>
      </div>
    </button>
  );
}
