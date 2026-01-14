"use client";

import Image from "next/image";

export default function HeroRightMedia() {
  return (
    <div className="flex-1 hidden md:block">
      <Image
        src="/error/elephant.svg"
        alt="임시"
        width={40}
        height={120}
        className="w-full h-auto select-none drop-shadow-[10px_5px_3px_rgba(0,0,0,0.10)]"
        priority={false}
      />
    </div>
  );
}
