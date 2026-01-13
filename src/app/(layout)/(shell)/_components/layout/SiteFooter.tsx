import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function SiteFooter() {
  return (
    <footer className="flex gap-5 items-center w-full backdrop-blur-sm bg-transparent border-t border-foreground/10 justify-between px-5 md:px-10 py-4 mt-40">
      <a
        href="https://github.com/swallowedB"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 px-3 py-1.5 mt-1 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-all duration-200"
        aria-label="깃허브로 이동"
      >
        <FaGithub />
        <span className="text-foreground/60 text-[10px] md:text-sm">
          @swallowedB
        </span>
      </a>
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

      <p className="text-foreground/30 text-[9px] md:text-xs pt-2">
        © {new Date().getFullYear()} b0o0a · All Rights Reserved
      </p>
    </footer>
  );
}
