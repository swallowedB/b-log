"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCommandPalette } from "@/components/common/CommandPalette";

export function useSearchTransition() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { openPalette } = useCommandPalette();

  const [pastThreshold, setPastThreshold] = useState(false);

  useEffect(() => {
    if (!isHome) {
      return;
    }

    const threshold = 320;

    const handleScroll = () => {
      setPastThreshold(window.scrollY > threshold);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const showSearch = !isHome || pastThreshold;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () =>
    setIsMobileMenuOpen((prev) => !prev);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleSearchClick = () => {
    openPalette();
  };

  return {
    isHome,
    showSearch,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    handleSearchClick,
  };
}
