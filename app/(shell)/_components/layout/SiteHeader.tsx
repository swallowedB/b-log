"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ToggleModeButton } from "../ui/toggle";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-background/5 backdrop-blur-md border-b border-foreground/10 ">
      <div className="flex items-center justify-between px-5 md:px-10 py-1.5">
        <Link href="/" aria-label="홈으로 이동">
          <div className="dark:hidden">
            <Image
              src="/logo.svg"
              alt="B-log"
              width={90}
              height={20}
              className="md:w-22 w-13 h-auto transition-all "
            />
          </div>
          <div className="hidden dark:block">
            <Image
              src="/logo-dark.svg"
              alt="B-log"
              width={90}
              height={20}
              className="md:w-22 w-13 h-auto transition-all "
            />
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {/* 데스크탑 버전 */}
          <div className="hidden md:flex gap-9 items-center text-lg font-medium text-foreground transition-colors ">
            <nav aria-label="주요 페이지">
              <ul className="flex gap-10 items-center ">
                <li>
                  <Link href="/resume">Resume</Link>
                </li>
                <li>
                  <Link href="/guestbook">Guestbook</Link>
                </li>
                <li>
                  <Link href="/lab">Lab</Link>
                </li>
              </ul>
            </nav>

            <div className="hidden md:block">
              <ToggleModeButton />
            </div>
          </div>

          {/* 모바일 반응형 - 메뉴 아이콘 추가 */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="모바일 메뉴 열기"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {/* 모바일 메뉴 */}
      <div
        className={`
            md:hidden 
            overflow-hidden 
            transition-all duration-300
            ${open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}
            `}
      >
        <nav className="px-10 pb-4 text-lg font-medium text-foreground">
          <ul className="flex flex-col gap-4">
            <li>
              <Link href="/resume" onClick={() => setOpen(false)}>
                Resume
              </Link>
            </li>
            <li>
              <Link href="/guestbook" onClick={() => setOpen(false)}>
                Guestbook
              </Link>
            </li>
            <li>
              <Link href="/lab" onClick={() => setOpen(false)}>
                Lab
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
