"use client";

import clsx from "clsx";
import { X } from "lucide-react";
import Image from "next/image";

interface WipFeatureCardProps {
  onClose: () => void;
  className?: string;
}

export function WipFeatureCard({ onClose, className }: WipFeatureCardProps) {
  return (
    <div
      className={clsx("relative w-[min(440px,90vw)]", className)}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="준비중 안내 닫기"
        className={clsx(
          "absolute right-8 top-2 z-10 ",
          "inline-flex items-center justify-center",
          "h-7 w-7 rounded-full",
          "text-black/20 hover:text-white",
          "hover:bg-black/10 cursor-pointer",
          "transition rotate-80 "
        )}
      >
        <X size={16} strokeWidth={3} />
      </button>

      <Image
        src="/error/wip-card.svg"
        alt="준비 중 안내 카드"
        width={740}
        height={420}
        className="w-full h-auto select-none drop-shadow-[10px_5px_3px_rgba(0,0,0,0.10)]"
        priority={false}
      />
    </div>
  );
}
