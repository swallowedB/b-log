"use client";

import clsx from "clsx";

interface SpaceBackgroundProps {
  className?: string;
}

export function SpaceBackground({ className }: SpaceBackgroundProps) {
  return (
    <div
      className={clsx(
        "absolute inset-0 -z-20 overflow-hidden space-bg-gradient",
        className
      )}
    >
      {/* 작은 별 배경 레이어 */}
      <div className="space-bg-stars" />

      {/* 별똥별들 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="shooting-star shooting-star--1" />
        <div className="shooting-star shooting-star--2" />
        <div className="shooting-star shooting-star--3" />
      </div>
    </div>
  );
}
