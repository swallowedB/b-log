"use client";

import { DockState } from "@/app/(layout)/(shell)/_components/dock/dock.types";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface UseDockInteractionParams {
  openDock: () => void;
  closeDock: () => void;
  hideDock: () => void;
  dockState: DockState; 
}

const CATEGORY_PATHS = ["/insight", "/dev-log", "/journal"];

export function useDockInteraction({
  openDock,
  closeDock,
  hideDock,
  dockState,
}: UseDockInteractionParams) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isResume = pathname === "/resume";
  const isCategory = CATEGORY_PATHS.includes(pathname);

  useEffect(() => {
    if (!isResume) return;

    closeDock();
  }, [isResume, closeDock]);

  useEffect(() => {
    if (!isHome && !isCategory) return;

    const trigger = document.querySelector<HTMLElement>(
      '[data-dock-collapse-trigger="posts"]'
    );
    if (!trigger) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          closeDock();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [pathname, isHome, isCategory, closeDock]);

  useEffect(() => {
    if (!isCategory) return;

    openDock();

    const timer = setTimeout(() => {
      closeDock();
    }, 1800);

    return () => clearTimeout(timer);
  }, [isCategory, openDock, closeDock]);

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset;

      if (y <= 10) {
        openDock();
      }
    };
    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome, openDock]);

  useEffect(() => {
    if (isResume) return;

    const handleBottom = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = docHeight - (scrollY + viewportHeight);

      const THRESHOLD = 40;

      if (distanceFromBottom <= THRESHOLD) {
        if (dockState !== "hidden") {
          hideDock();
        }
      } else {
        if (dockState === "hidden") {
          closeDock();
        }
      }
    };

    window.addEventListener("scroll", handleBottom);
    handleBottom();

    return () => window.removeEventListener("scroll", handleBottom);
  }, [dockState, hideDock, closeDock, isResume]);

  return { isHome, isCategory };
}
