import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function SiteFooter() {
  return (
    <footer className="flex gap-5 items-center w-full bg-background/70 backdrop-blur-sm mt-20 border-t border-foreground/10 justify-between px-10 py-4">
      <div className="flex items-center gap-5">
        <Link href="/" aria-label="홈으로 이동">
          <Image src="/favicon.svg" alt="B-log" width={40} height={20} />
        </Link>
        <a
          href="https://github.com/swallowedB"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 mt-1 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-all duration-200"
          aria-label="깃허브로 이동"
        >
          <FaGithub />
          <span className="text-foreground/60 text-sm">@swallowedB</span>
        </a>
      </div>
        <p className="text-foreground/30 text-xs pt-2">
          © {new Date().getFullYear()} CHOI BOA · All Rights Reserved
        </p>
    </footer>
  );
}
