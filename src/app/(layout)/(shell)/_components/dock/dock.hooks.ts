import { useCallback, useRef, useState } from "react";
import { DEFAULT_STYLE } from "./_constants/dock.config";
import { DOCK_ITEMS } from "./_constants/dockItem.config";
import { DockState, IconStyle } from "./dock.types";
import { calculateIconStyle } from "./dock.utils";

export const useDockMenu = () => {
  const [dockState, setDockState] = useState<DockState>("expanded");
  const [iconStyles, setIconStyles] = useState<IconStyle[]>(() =>
    DOCK_ITEMS.map(() => DEFAULT_STYLE)
  );
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // 스타일 리셋
  const resetStyles = useCallback(() => {
    setIconStyles(DOCK_ITEMS.map(() => DEFAULT_STYLE));
  }, []);

  // 마우스 호버 효과
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLUListElement>) => {
      if (dockState !== "expanded") return;

      const mouseX = e.clientX;
      const newStyles: IconStyle[] = DOCK_ITEMS.map((item, index) => {
        if (item.type === "divider") return DEFAULT_STYLE;

        const el = itemRefs.current[index];
        if (!el) return DEFAULT_STYLE;

        const rect = el.getBoundingClientRect();
        return calculateIconStyle(mouseX, rect);
      });

      setIconStyles(newStyles);
    },
    [dockState]
  );

  // Dock 토글
  const toggleDock = useCallback(() => {
    setDockState((prev: DockState) => {
      if (prev === "expanded") {
        resetStyles();
        return "collapsed";
      }
      return "expanded";
    });
  }, [resetStyles]);

  return {
    dockState,
    iconStyles,
    itemRefs,
    handleMouseMove,
    resetStyles,
    toggleDock,
  };
};
