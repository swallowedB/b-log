"use client";

import Image from "next/image";
import Link from "next/link";
import { ToggleModeButton } from "../ui/toggle";

export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-10 py-4 bg-background/5 backdrop-blur-md border-b border-foreground/10 ">
      <Link href="/" aria-label="홈으로 이동">
        <Image
          src="/logo.svg"
          alt="B-log"
          width={90}
          height={20}
          className="dark:hidden"
        />
        <Image
          src="/logo-dark.svg"
          alt="B-log"
          width={90}
          height={20}
          className="hidden dark:block"
        />
      </Link>

      <div className="flex gap-9 items-center text-lg font-medium text-foreground transition-colors ">
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

        <ToggleModeButton />
      </div>
    </header>
  );
}
