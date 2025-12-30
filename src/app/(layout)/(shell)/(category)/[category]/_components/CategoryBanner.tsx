"use client";

import clsx from "clsx";

interface CategoryBannerProps {
  categoryLabel: string;
  date: string;
  title: string;
  excerpt: string;
  tags: string[];
}

export default function CategoryBanner({
  categoryLabel,
  date,
  title,
  excerpt,
  tags,
}: CategoryBannerProps) {
  return (
    <section className="w-full">
      <div
        className={clsx(
          "relative mx-auto h-auto w-full overflow-hidden",
          "rounded-4xl bg-white/25 backdrop-blur-xl outline-1 outline-white/40",
          "shadow-[ -2px_-2px_12px_-8px_rgba(0,0,0,0.15),-12px_-11px_48px_-12px_rgba(0,0,0,0.15),inset_1.2px_1.1px_4.6px_rgba(255,255,255,0.13),inset_2.1px_2px_9.2px_rgba(255,255,255,0.13) ]",
          "shadow-card-soft border-0.5 border-gray-300/30"
        )}
      >
        <div className="grid h-full grid-cols-[minmax(0,0.55fr)_minmax(0,0.5fr)] gap-10 p-[7px]">
          {/* 왼쪽 썸네일 영역 */}
          <div className="h-full rounded-l-3xl bg-linear-to-br from-[#f97316] via-[#ec4899] to-[#6366f1]" />

          {/* 오른쪽 콘텐츠 패널 */}
          <div className="relative h-full rounded-r-3xl bg-white px-2 py-7">
            <div
              className={clsx(
                "pointer-events-none absolute inset-y-0 -left-24 w-24",
                "bg-linear-to-r from-transparent via-white to-white"
              )}
            />

            {/* 상단 카테고리 / 날짜 */}
            <div className="relative flex items-center gap-2 text-[10px] font-medium text-black/40">
              <span>{categoryLabel}</span>
              <span className="h-0.5 w-0.5 rounded-full bg-neutral-500/30" />
              <span>{date}</span>
            </div>

            <section className="relative flex flex-col space-y-4 w-[90%] ">
              {/* 제목 */}
              <h3 className=" mt-4 text-lg font-bold text-zinc-900 md:text-2xl line-clamp-2">
                {title}
              </h3>

              {/* 본문 요약 */}
              <p className=" mt-1 text-xs line-clamp-3 leading-5 text-black/50 md:text-sm">
                {excerpt}
              </p>

              {/* 태그 영역 */}
              <div className="mt-2 -pl-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-900/5 px-3 py-1 text-xs font-semibold text-zinc-900/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
