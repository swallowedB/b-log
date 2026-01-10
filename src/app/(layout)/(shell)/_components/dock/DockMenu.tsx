"use client";

import {
  DOCK_LIST_ENTRANCE_VARIANTS,
  DOCK_NAV_VARIANTS,
} from "@/app/(layout)/(shell)/_components/dock/_constants/dock.motion";
import { DOCK_ITEMS } from "@/app/(layout)/(shell)/_components/dock/_constants/dockItem.config";
import { useDockCloseHint } from "@/app/(layout)/(shell)/_components/dock/hook/useDockCloseHint";
import { useDockInteraction } from "@/app/(layout)/(shell)/_components/dock/hook/useDockInteraction";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronsDown } from "lucide-react";
import { DEFAULT_STYLE } from "./_constants/dock.config";
import { getDockClasses } from "./dock.utils";
import { DockMenuItem } from "./DockMenuItem";
import { useDockMenu } from "./hook/useDockMenu";

export default function DockMenu() {
  const {
    dockState,
    iconStyles,
    itemRefs,
    handleMouseMove,
    resetStyles,
    toggleDock,
    openDock,
    closeDock,
    hideDock,
  } = useDockMenu();

  useDockInteraction({ openDock, closeDock, hideDock, dockState });

  const isExpanded = dockState === "expanded";
  const isHidden = dockState === "hidden";

  const {
    showCloseHint,
    handleNavMouseEnter,
    handleNavMouseLeave,
    hideCloseHint,
  } = useDockCloseHint({
    isExpanded,
    hideDelay: 800,
  });

  if (isHidden) return null;

  return (
    <div className="hidden md:block fixed inset-0 z-50 pointer-events-none">
      <motion.nav
        aria-label="Dock menu"
        className={clsx(
          getDockClasses(dockState),
          isHidden && "pointer-events-none"
        )}
        variants={DOCK_NAV_VARIANTS}
        initial={isExpanded ? "expanded" : "collapsed"}
        animate={isExpanded ? "expanded" : "collapsed"}
        onClick={!isExpanded && !isHidden ? toggleDock : undefined}
        onMouseEnter={handleNavMouseEnter}
        onMouseLeave={handleNavMouseLeave}
      >
        {isExpanded && (
          <motion.ul
            className="flex items-end gap-5"
            onMouseMove={handleMouseMove}
            onMouseLeave={resetStyles}
            variants={DOCK_LIST_ENTRANCE_VARIANTS}
            initial="hidden"
            animate="visible"
          >
            {DOCK_ITEMS.map((item, index) => {
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
          </motion.ul>
        )}

        {dockState === "collapsed" && (
          <button
            type="button"
            onClick={toggleDock}
            aria-label="Dock 열기"
            className="flex items-center justify-center gap-1"
          >
            <span className="w-1 h-1 rounded-full bg-foreground/70 dark:bg-white/70" />
            <span className="w-1 h-1 rounded-full bg-foreground/70 dark:bg-white/70" />
            <span className="w-1 h-1 rounded-full bg-foreground/70 dark:bg-white/70" />
          </button>
        )}
      </motion.nav>

      <AnimatePresence>
        {isExpanded && showCloseHint && (
          <motion.button
            type="button"
            onClick={() => {
              closeDock();
              hideCloseHint();
            }}
            aria-label="Dock 닫기"
            className={clsx(
              "pointer-events-auto fixed left-1/2 -translate-x-1/2 bottom-0",
              "flex items-center justify-center rounded-full",
              "px-5 py-2 text-sm text-foreground/60 dark:text-white/60",
              "cursor-pointer"
            )}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <ChevronsDown
              size={20}
              strokeWidth={1.6}
              aria-hidden="true"
              style={{
                transform: "scaleX(1.6)",
                transformOrigin: "center",
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
