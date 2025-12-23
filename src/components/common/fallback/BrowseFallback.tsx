import BoabamIcon from "@/components/common/icons/BoabamIcon";

interface BrowseFallbackProps {
  title?: string;
  description?: string;
}

export default function BrowseFallback({
  title = "보아뱀이 글을 삼키는 중이에요.",
  description = "잠시 다른 곳 구경하고 오시면, 더 맛있게 정리해 둘게요.",
}: BrowseFallbackProps) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 mt-10 py-14 text-center">
      <BoabamIcon className="w-50 text-foreground/25 dark:text-white/70" />

      {/* 텍스트 */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground/70">
          {title}
        </p>
        <p className="text-xs text-foreground/50">
          {description}
        </p>
      </div>
    </section>
  );
}
