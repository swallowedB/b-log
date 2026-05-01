import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export interface PostCardProps {
  href: string;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  category: string;
  date: string;
  title: string;
  excerpt?: string;
  className?: string;
  size?: "md" | "sm";
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
  size = "md",
}: PostCardProps) {
  const isSmall = size === "sm";
  const fallbackSrc = "/post-fallback.png";
  const finalSrc = thumbnailSrc || fallbackSrc;
  const finalAlt = thumbnailAlt || `${title} 썸네일 이미지`;

  return (
    <Link
      href={href}
      draggable={false}
      className={clsx(
        "group block w-full h-full px-5 sm:px-0 focus:outline-none ",
        className,
      )}
      aria-label={`${title} 게시글로 이동`}
    >
      {/* 레이어 컨테이너 */}
      <div
        className={clsx(
          "relative h-full overflow-hidden rounded-3xl shadow-card-soft",
          "transition-transform duration-150",
          "md:group-hover:scale-[1.03] md:group-hover:-translate-y-0.5",
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
            "backdrop-blur-xl",
          )}
        />

        {/* 실제 카드 내용 박스*/}
        <div
          className={clsx(
            "relative h-full z-10 bg-white dark:bg-[#0b0d37] dark:glass-card",
            "p-1.5 ",
          )}
        >
          {/* 썸네일 */}
          <div
            className={clsx(
              "relative w-full rounded-t-[1.1rem] overflow-hidden",
              isSmall ? "aspect-6/3" : "aspect-video",
            )}
          >
            <Image
              src={finalSrc}
              alt={finalAlt}
              draggable={false}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 80vw, 320px"
              priority={false}
            />

            {/* 썸네일 위 바텀 그라데이션 */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white dark:to-[#0b0d37]" />
          </div>

          {/* 포스트 내용 */}
          <div
            className={clsx(
              "flex flex-1 flex-col justify-between",
              isSmall ? "px-4 pt-1 pb-3" : "px-4.5 pt-4 pb-3.5",
            )}
          >
            <p
              className={clsx(
                "text-black/30 dark:text-white/40",
                isSmall ? "text-[10px]" : "text-xs tracking-wide ",
              )}
            >
              {category} <span className="px-1">·</span> {date}
            </p>

            <h3
              itemProp="headline"
              className={clsx(
                "leading-snug text-black dark:text-white line-clamp-1",
                isSmall
                  ? "mt-1 font-semibold text-sm"
                  : "mt-1.5 text-base font-bold",
              )}
            >
              {title}
            </h3>

            <p
              className={clsx(
                "text-gray-800 dark:text-gray-200/80",
                isSmall
                  ? "mt-1.5 line-clamp-2 text-[10px] leading-tight"
                  : "mt-2 line-clamp-2 text-xs",
              )}
            >
              {excerpt}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
