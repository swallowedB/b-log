import type { Variants } from "framer-motion";

export const DOCK_NAV_VARIANTS: Variants = {
  expanded: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 22,
      mass: 0.7,
    },
  },
  collapsed: {
    y: 16,
    opacity: 0.97,
    scale: 0.95,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 24,
      mass: 0.7,
    },
  },
  hidden: {
    y: 32,
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.18,
      ease: "easeOut",
    },
  },
};

export const DOCK_LIST_ENTRANCE_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 20,
      mass: 0.7,
      delayChildren: 0.04, 
      staggerChildren: 0.02, 
    },
  },
};

export const DOCK_ITEM_ENTRANCE_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 380, 
      damping: 20,
      mass: 0.55,
    },
  },
};
