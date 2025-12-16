import { DOCK_CONFIG } from "./dock.constants";
import { DockState, IconStyle } from "./dock.types";

/**
 * 마우스 위치에 따른 아이콘 스타일 계산
 * @param mouseX - 마우스 X 좌표
 * @param elementRect - 아이콘 요소의 DOMRect
 * @returns 계산된 스타일 (scale, translateY)
 */

export const calculateIconStyle = (
  mouseX: number,
  elementRect: DOMRect
): IconStyle => {
  const centerX = elementRect.left + elementRect.width / 2;
  const distance = Math.abs(mouseX - centerX);

  const clamped = Math.min(distance, DOCK_CONFIG.MOUSE_MAX_DISTANCE);
  const t = 1 - clamped / DOCK_CONFIG.MOUSE_MAX_DISTANCE;

  const scale =
    DOCK_CONFIG.SCALE_MIN + t * (DOCK_CONFIG.SCALE_MAX - DOCK_CONFIG.SCALE_MIN);
  const translateY = DOCK_CONFIG.TRANSLATE_Y_MAX * t;

  return { scale, translateY };
};

/**
 * Dock 상태에 따른 CSS 클래스 생성
 * @param dockState - 현재 Dock 상태
 * @returns Tailwind CSS 클래스 문자열
 */
export const getDockClasses = (dockState: DockState): string => {
  const base =
    "pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 text-foreground rounded-3xl border border-foreground/13 glass-basic backdrop-blur-md transition-all duration-300";

  switch (dockState) {
    case "expanded":
      return `${base} px-7 py-3 opacity-100 translate-y-0`;
    case "collapsed":
      return `${base} px-2 py-2 opacity-50 hover:opacity-90 cursor-pointer translate-y-0`;
    case "hidden":
      return `${base} px-2 py-2 opacity-0 translate-y-8 pointer-events-none`;
    default:
      return base;
  }
};