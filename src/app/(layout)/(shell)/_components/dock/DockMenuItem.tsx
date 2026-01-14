/* eslint-disable @next/next/no-img-element */
import { DOCK_ITEM_ENTRANCE_VARIANTS } from "@/app/(layout)/(shell)/_components/dock/_constants/dock.motion";
import { motion } from "framer-motion";
import Link from "next/link";
import { DOCK_CONFIG } from "./_constants/dock.config";
import { DockMenuItemProps } from "./dock.types";

export const DockMenuItem = ({ item, style, onRef, onClick, }: DockMenuItemProps) => {
  const renderContent = () => {
    const imgElement = (
      <img src={item.icon} alt={item.label} className="w-12 h-auto" />
    );

    const commonClasses = "cursor-pointer block focus:outline-none rounded-lg";

    if (item.type === "link") {
      return (
        <Link
          aria-label={item.label}
          href={item.href!}
          className={commonClasses}
          tabIndex={0}
        >
          {imgElement}
        </Link>
      );
    }

    if (item.type === "mailto") {
      return (
        <a
          href={item.href!}
          aria-label={item.label}
          className={commonClasses}
          tabIndex={0}
        >
          {imgElement}
        </a>
      );
    }

    if (item.type === "button") {
      return (
        <button
          type="button"
          aria-label={item.label}
          onClick={onClick ?? item.onClick}
          className={commonClasses}
          tabIndex={0}
        >
          {imgElement}
        </button>
      );
    }

    return null;
  };

  return (
    <motion.li
      ref={onRef}
      className="relative group flex items-center"
      variants={DOCK_ITEM_ENTRANCE_VARIANTS}
    >
      <div
        style={{
          transform: `translateY(${style.translateY}px) scale(${style.scale})`,
          transformOrigin: "bottom center",
          transition: `transform ${DOCK_CONFIG.ANIMATION_DURATION}ms ease-out`,
        }}
      >
        {renderContent()}
      </div>

      {/* 툴팁 */}
      <div
        className={`
          absolute -top-16 left-1/2 -translate-x-1/2 tooltip
          bg-foreground/50 dark:bg-[#a1a1a178] text-white
        `}
      >
        {item.tooltip}
      </div>
    </motion.li>
  );
};
