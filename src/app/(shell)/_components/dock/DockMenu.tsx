"use client";
import { DOCK_ITEMS } from "@/src/app/(shell)/_constants/dockItems";
import { DEFAULT_STYLE } from "./dock.constants";
import { useDockMenu } from "./dock.hooks";
import { getDockClasses } from "./dock.utils";
import { DockMenuItem } from "./DockMenuItem";

export default function DockMenu() {
  const {
    dockState,
    iconStyles,
    itemRefs,
    handleMouseMove,
    resetStyles,
    toggleDock,
  } = useDockMenu();

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <nav
        aria-label="Dock menu"
        className={getDockClasses(dockState)}
        onClick={dockState === "collapsed" ? toggleDock : undefined}
      >
        <ul
          className="flex items-end gap-5 transition-all duration-150"
          onMouseMove={handleMouseMove}
          onMouseLeave={resetStyles}
        >
          {dockState === "expanded" &&
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

              const style = iconStyles[index] ?? DEFAULT_STYLE;

              return (
                <DockMenuItem
                  key={item.label}
                  item={item}
                  style={style}
                  onRef={(el) => {
                    itemRefs.current[index] = el;
                  }}
                />
              );
            })}
        </ul>

        {dockState === "collapsed" && (
          <button
            type="button"
            onClick={toggleDock}
            aria-label="Dock 열기"
            className="flex items-center justify-center gap-1 transition-opacity duration-150 opacity-100"
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
