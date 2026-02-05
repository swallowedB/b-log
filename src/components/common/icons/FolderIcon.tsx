"use client";
import FolderSvg from "@/assets/svg/Folder-series.svg";
import clsx from "clsx";
import { CSSProperties } from "react";

export type FolderTone = "gray" | "blue" | "pink" | "purple" | "orange" | "darkblue";

const TONE_COLOR: Record<FolderTone, string> = {
  gray: "#9c9fa9",
  blue: "#0ea5e9",
  darkblue: "#357fff",
  pink: "#ff66b2",
  purple: "#8679ec",
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
