"use client";
import FolderSvg from "@/assets/svg/Folder-series.svg";
import clsx from "clsx";
import { CSSProperties } from "react";

export type FolderTone = "gray" | "blue" | "pink" | "purple" | "orange";

const TONE_COLOR: Record<FolderTone, string> = {
  gray: "#AEB4C5",
  blue: "#0ea5e9",
  pink: "#ff66b2",
  purple: "#6da0ff",
  orange: "#FB923C",
};
interface FolderIconProps {
  className?: string;
  size?: number;
  tone?: FolderTone;
}

export default function FolderIcon({
  className,
  size = 96,
  tone = "blue",
}: FolderIconProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
    color: TONE_COLOR[tone],
  };
  return (
    <div
      className={clsx(
        "folder-root",
        "inline-flex items-center justify-center cursor-pointer",
        className
      )}
      style={style}
    >
      <FolderSvg className="h-full w-full" />
    </div>
  );
}
