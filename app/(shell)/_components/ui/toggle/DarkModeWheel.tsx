"use client";

import "@/app/(shell)/styles/dark-mode-wheel.css";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RiMoonFill, RiSunFill } from "react-icons/ri";

export default function DarkModeWheel() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

// eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      aria-label="테마 변경"
      aria-pressed={isDark}
      className="relative focus:outline-none pt-1"
      type="button"
    >
      <div className="dark-wheel-scale">
        <div className="dark-wheel">
          {/* 외곽 요소 */}
          <div className="dark-wheel-outer" />
          <div className="dark-wheel-clip dark-wheel-clip-l" />
          <div className="dark-wheel-clip dark-wheel-clip-r" />
          <div className="dark-wheel-clip-h dark-wheel-clip-t" />
          <div className="dark-wheel-clip-h dark-wheel-clip-b" />
          <div className="dark-wheel-inner-shadow" />
          <div className="dark-wheel-elip dark-wheel-elip-l" />
          <div className="dark-wheel-elip dark-wheel-elip-r" />

          {/* 회전하는 실린더 */}
          <motion.div
            className="dark-wheel-inner"
            animate={{ rotateX: isDark ? 180 : 0 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 22,
            }}
          >
            <div className="dark-wheel-button dark-wheel-button-1 dark-wheel-men-1">
              <div className="dark-wheel-face">
                <RiSunFill size={12} className="text-white" />
              </div>
            </div>

            <div className="dark-wheel-button dark-wheel-button-2 dark-wheel-men-2" />

            <div className="dark-wheel-button dark-wheel-button-3 dark-wheel-men-3" />

            <div className="dark-wheel-button dark-wheel-button-4 dark-wheel-men-4">
              <div className="dark-wheel-face">
                <RiMoonFill size={12} className="text-white pb-[1px]" />
              </div>
            </div>
            <div className="dark-wheel-button dark-wheel-button-5 dark-wheel-men-5" />
            <div className="dark-wheel-button dark-wheel-button-6 dark-wheel-men-6" />
          </motion.div>
        </div>
      </div>
    </button>
  );
}
