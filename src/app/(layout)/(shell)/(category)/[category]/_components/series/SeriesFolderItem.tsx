"use client";

import FolderIcon, { FolderTone } from "@/components/common/icons/FolderIcon";

interface SeriesFolderItemProps {
  name: string;
  postCount: number;
  tone?: FolderTone;
}

export default function SeriesFolderItem({
  name,
  postCount,
  tone = "blue",
}: SeriesFolderItemProps) {
  return (
    <button type="button" className="group relative text-left">
      <div
        className="
      relative
      w-[150px] h-[160px]      
      sm:w-[170px] sm:h-[185px] 
      md:w-[190px] md:h-[205px] 
      lg:w-[200px] lg:h-[210px]
    "
      >
        <FolderIcon
          tone={tone}
          size={210}
          className="transition-transform duration-200" 
        />

        <div className="pointer-events-none absolute bottom-6 left-5 flex flex-col px-5 py-5">
          <p className="text-lg font-semibold text-white tracking-wider ">
            {name}
          </p>

          <div className="flex gap-10 items-baseline text-[10px] xl:text-xs text-white/60 ">
            <span>총 {postCount}개의 포스트</span>
          </div>
        </div>
      </div>
    </button>
  );
}
