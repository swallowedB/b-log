"use client";
import FolderSvg from "@/assets/svg/Folder-series.svg";
import clsx from "clsx";
import { CSSProperties } from "react";

export type FolderTone = "gray" | "blue" | "pink" | "purple" | "orange" | "darkblue";

const TONE_COLOR: Record<FolderTone, string> = {
  gray: "#6c6c6c",
  blue: "#0da1e6",
  darkblue: "#2371f8",
  pink: "#ff66b2",
  purple: "#6454de",
  orange: "#f1842a",
};

interface FolderIconProps {
  className?: string;
  tone?: FolderTone;
}

export default function FolderIcon({
  className,
  tone = "blue",
}: FolderIconProps) {
  const style: CSSProperties = {
    color: TONE_COLOR[tone],
  };
  return (
    <div
      className={clsx(
        "folder-root",
        "w-full h-full",
        "inline-flex items-center justify-center cursor-pointer",
        className
      )}
      style={style}
    >
      <FolderSvg className="h-full w-full" />
    </div>
  );
}
