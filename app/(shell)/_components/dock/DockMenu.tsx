/* eslint-disable @next/next/no-img-element */
"use client";
import { DOCK_ITEMS } from "@/app/(shell)/_constants/dockItems";
import Link from "next/link";
import { useRef, useState } from "react";

type IconStyle = {
  scale: number;
  translateY: number;
};

const DEFAULT_STYLE: IconStyle = { scale: 1, translateY: 0 };

export default function DockMenu() {
  const [isExpanded, setIsExpanded] = useState(false);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [iconStyles, setIconStyles] = useState<IconStyle[]>(() =>
    DOCK_ITEMS.map(() => DEFAULT_STYLE)
  );

  const resetStyles = () => {
    setIconStyles(DOCK_ITEMS.map(() => DEFAULT_STYLE));
  };

  const handleMouseMove: React.MouseEventHandler<HTMLUListElement> = (e) => {
    if (!isExpanded) return;

    const mouseX = e.clientX;

    const newStyles: IconStyle[] = DOCK_ITEMS.map((item, index) => {
      if (item.type === "divider") return DEFAULT_STYLE;

      const el = itemRefs.current[index];
      if (!el) return DEFAULT_STYLE;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      const distance = Math.abs(mouseX - centerX);

      const maxDistance = 100;
      const maxScale = 1.3;
      const minScale = 1;

      const clamped = Math.min(distance, maxDistance);
      const t = 1 - clamped / maxDistance;

      const scale = minScale + t * (maxScale - minScale);
      const translateY = -8 * t;

      return { scale, translateY };
    });

    setIconStyles(newStyles);
  };

  const handleMouseLeave = () => {
    resetStyles();
  };

  const toggleDock = () => {
    if (isExpanded) resetStyles();
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <nav
        aria-label="Dock menu"
        className={`pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 text-foreground rounded-3xl border border-foreground/13 glass-basic backdrop-blur-md transition-all duration-200
        ${isExpanded ? "px-7 py-3" : "cursor-pointer px-2 py-2 opacity-50 hover:opacity-90"}  
        `}
      >
        <ul
          className={`flex items-end gap-5
            transition-all duration-150
            
            `}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {isExpanded &&
            DOCK_ITEMS.map((item, index) => {
              if (item.type === "divider") {
                return (
                  <li
                    key={`divider-${index}`}
                    aria-hidden="true"
                    className="h-12 w-px mx-1 bg-foreground/20"
                  />
                );
              }

              const Icon = item.icon;
              const style = iconStyles[index] ?? DEFAULT_STYLE;

              return (
                <li
                  key={item.label}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className={`relative group flex items-center`}
                >
                  {/* 아이콘 래퍼 */}
                  <div
                    style={{
                      transform: `translateY(${style.translateY}px) scale(${style.scale})`,
                      transformOrigin: "bottom center",
                      transition: "transform 120ms ease-out",
                    }}
                  >
                    {item.type === "link" && (
                      <Link
                        aria-label={item.label}
                        href={item.href}
                        className="cursor-pointer block"
                      >
                        <img
                          src={Icon.src}
                          alt={item.label}
                          className="w-12 h-auto"
                        />
                      </Link>
                    )}

                    {item.type === "mailto" && (
                      <a
                        href={item.href}
                        aria-label={item.label}
                        className="cursor-pointer block"
                      >
                        <img
                          src={Icon.src}
                          alt={item.label}
                          className="w-12 h-auto"
                        />
                      </a>
                    )}

                    {item.type === "button" && (
                      <button
                        type="button"
                        aria-label={item.label}
                        onClick={item.onClick}
                        className="cursor-pointer block"
                      >
                        <img
                          src={Icon.src}
                          alt={item.label}
                          className="w-12 h-auto"
                        />
                      </button>
                    )}
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
            })}
        </ul>
        {!isExpanded && (
          <button
            type="button"
            onClick={toggleDock}
            aria-label={isExpanded ? "Dock 닫기" : "Dock 열기"}
            className={`
          flex items-center justify-center gap-1
          transition-opacity duration-150
          ${isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
          >
            <span className="w-1 h-1 rounded-full bg-foreground/70 dark:bg-white/70" />
            <span className="w-1 h-1 rounded-full bg-foreground/70 dark:bg-white/70" />
            <span className="w-1 h-1 rounded-full bg-foreground/70 dark:bg-white/70" />

          </button>
        )}
      </nav>
    </div>
  );
}
