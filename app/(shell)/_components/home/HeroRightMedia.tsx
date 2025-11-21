"use client";

export default function HeroRightMedia() {
  return (
    <div className="flex-1 hidden md:block">
      <div className="relative mx-auto aspect-4/3 bg-foreground/20 max-w-lg w-full overflow-hidden rounded-3xl border">
        {/* 배경 효과 (리퀴드 글래스, 글로우 등은 여기서 스타일링) */}
        <div className="absolute inset-0" aria-hidden />
        <div className="relative h-full w-full">
        </div>
      </div>
    </div>
  )
}
