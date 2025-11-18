/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { DOCK_CONFIG } from "./dock.constants";
import { DockMenuItemProps } from "./dock.types";

export const DockMenuItem = ({ item, style, onRef }: DockMenuItemProps) => {
  const Icon = item.icon;

  const renderContent = () => {
    const imgElement = (
      <img src={Icon.src} alt={item.label} className="w-12 h-auto" />
    );

    const commonClasses =
      "cursor-pointer block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg";

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
          onClick={item.onClick}
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
    <li ref={onRef} className="relative group flex items-center">
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
          bg-foreground/80 dark:bg-white/10 text-white
        `}
      >
        {item.tooltip}
      </div>
    </li>
  );
};
