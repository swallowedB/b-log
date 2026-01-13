"use client";
import { useSearchTransition } from "@/app/(layout)/(shell)/_components/home/_hooks/useSearchTransition";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DarkModeWheel from "../../../../../components/ui/DarkModeWheel";

export default function SiteHeader() {
  const {
    showSearch,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    handleSearchClick,
  } = useSearchTransition();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-foreground/10 bg-background/5 backdrop-blur-md">
      <div className="flex items-center justify-between px-5 py-1 md:px-10">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="홈으로 이동" className="hidden md:block">
            <Image src="/favicon.svg" alt="B-log" width={30} height={10} />
          </Link>

          <AnimatePresence initial={false}>
            {showSearch && (
              <motion.button
                key="header-search"
                type="button"
                onClick={handleSearchClick}
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={clsx(
                  "min-w-46 cursor-pointer ",
                  "hidden items-center gap-2 rounded-full",
                  "bg-neutral-200/50 ",
                  "dark:border dark:border-foreground/15 dark:bg-foreground/7 pl-3 pr-2 py-1",
                  "text-xs text-foreground/70 md:inline-flex"
                )}
              >
                <Search className="h-4 w-4" />
                <div className=" flex justify-between items-center w-full">
                  <span className="hidden lg:inline">검색</span>
                  <span className="hidden lg:inline py-1 pl-2.5 pr-2 rounded-3xl text-[10px]">
                    ⌘K
                  </span>
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-9 font-medium text-foreground/70 md:flex">
            <nav aria-label="주요 페이지" >
              <ul className="flex items-center gap-10">
                <li className="hover:text-foreground">
                  <Link  href="/resume">Resume</Link>
                </li>
                <li className="hover:text-foreground">
                  <Link href="/guestbook">Guestbook</Link>
                </li>
                <li className="hover:text-foreground"> 
                  <Link href="/lab">Lab</Link>
                </li>
              </ul>
            </nav>

            <div className="hidden md:block">
              <DarkModeWheel />
            </div>
          </div>

          <motion.button
            type="button"
            className="mr-2 md:hidden"
            onClick={handleSearchClick}
            aria-label="검색 열기"
            whileTap={{ scale: 0.9, opacity: 0.8 }}
            transition={{ duration: 0.08 }}
          >
            <Search size={22} />
          </motion.button>

          <motion.button
            type="button"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="모바일 메뉴 열기"
            whileTap={{ scale: 0.9, opacity: 0.8 }}
            transition={{ duration: 0.08 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden overflow-hidden border-t border-foreground/10 bg-background/90 backdrop-blur-md"
          >
            <nav className="px-10 pb-4 pt-3 text-lg font-medium text-foreground">
              <ul className="flex flex-col gap-4">
                <li>
                  <Link href="/resume" onClick={closeMobileMenu}>
                    Resume
                  </Link>
                </li>
                <li>
                  <Link href="/guestbook" onClick={closeMobileMenu}>
                    Guestbook
                  </Link>
                </li>
                <li>
                  <Link href="/lab" onClick={closeMobileMenu}>
                    Lab
                  </Link>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
