import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export interface PostCardProps {
  href: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  className?: string;
}

export default function PostCard({
  href,
  thumbnailSrc,
  thumbnailAlt,
  category,
  date,
  title,
  excerpt,
  className,
}: PostCardProps) {
  return (
    <Link
      href={href}
      draggable={false}
      className={clsx(
        "group block w-full h-full px-5 sm:px-0 focus:outline-none ",
        className
      )}
      aria-label={`${title} 게시글로 이동`}
    >
      {/* 레이어 컨테이너 */}
      <div
        className={clsx(
          "relative h-full overflow-hidden rounded-3xl shadow-card-soft",
          "transition-transform duration-150",
          "md:group-hover:scale-[1.03] md:group-hover:-translate-y-0.5"
        )}
      >
        {/* 카드 */}
        <div
          aria-hidden
          className={clsx(
            "pointer-events-none absolute inset-0 rounded-3xl",
            "bg-linear-to-b from-white/40 via-white/10 to-white/70",
            "shadow-card-soft",
            "dark:from-white/10 dark:via-white/5 dark:to-white/10",
            "dark:bg-linear-to-b",
            "backdrop-blur-xl"
          )}
        />

        {/* 실제 카드 내용 박스*/}
        <div
          className={clsx(
            "relative h-full z-10 bg-white px-1 py-1.5",
            "transition-all duration-200",
            "rounded-3xl",
            "dark:bg-[#242544] dark:glass-card"
          )}
        >
          {/* 썸네일 */}
          <div className="relative aspect-video w-full h-auto rounded-t-[22px] overflow-hidden">
            <Image
              src={thumbnailSrc}
              alt={thumbnailAlt}
              draggable={false}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 80vw, 320px"
              priority={false}
            />

            {/* 썸네일 위 바텀 그라데이션 */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white dark:to-[#242544]" />
          </div>

          {/* 포스트 내용 */}
          <div className="flex flex-1 flex-col justify-between px-4.5 pt-4 pb-3.5">
            <p className="text-xs tracking-wide text-black/30 dark:text-white/40">
              {category} <span className="px-1">·</span> {date}
            </p>

            <h3 className="mt-1.5 text-lg font-bold leading-snug text-black dark:text-white line-clamp-1">
              {title}
            </h3>

            <p className="mt-2 text-xs text-gray-800 dark:text-gray-200/80 line-clamp-2">
              {excerpt}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
