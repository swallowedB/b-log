import { IconStyle } from "./dock.types";

export const DOCK_CONFIG = {
  MOUSE_MAX_DISTANCE: 100,
  SCALE_MAX: 1.3,
  SCALE_MIN: 1,
  TRANSLATE_Y_MAX: -5,
  ANIMATION_DURATION: 120,
  SCROLL_THRESHOLD: 100,
  SCROLL_DEBOUNCE: 150,
} as const;

export const DEFAULT_STYLE: IconStyle = { scale: 1, translateY: 0 };