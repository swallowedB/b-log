"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { WipFeatureCard } from "./WipFeatureCard";

interface WipFeatureOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WipFeatureOverlay({ isOpen, onClose }: WipFeatureOverlayProps) {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center"
          onClick={onClose} 
        >
          <motion.div
            key="wip-notice"
            initial={{ opacity: 0, x: "100%" }}
            animate={{
              opacity: 1,
              x: "0%",
              transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            exit={{
              opacity: 0,
              x: "-100%",
              transition: {
                duration: 0.35,
                ease: [0.45, 0, 0.55, 1],
              },
            }}
          >
            <WipFeatureCard onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
