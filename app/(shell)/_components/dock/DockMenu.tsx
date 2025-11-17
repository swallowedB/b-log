/* eslint-disable @next/next/no-img-element */
import FileIcon from "@/app/assets/svg/FileIcon.svg";
import MailIcon from "@/app/assets/svg/MailIcon.svg";
import PhotoboothIcon from "@/app/assets/svg/PhotoboothIcon.svg";
import Link from "next/link";

export default function DockMenu() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <nav
        aria-label="Dock menu"
        className="pointer-events-auto absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/10 text-foreground px-5 py-3 rounded-3xl border border-foreground/20 glass-basic backdrop-blur-lg"
      >
        <ul className="flex items-center gap-3">
          <li>
            <Link
              aria-label="DEV_LOG"
              href="/DEV_LOG"
              className="cursor-pointer"
            >
              <img src={FileIcon.src} alt="DEV_LOG" className="w-13 h-auto" />
            </Link>
          </li>
          <li>
            <Link
              aria-label="INSIGHT"
              href="/INSIGHT"
              className="cursor-pointer"
            >
              <img src={FileIcon.src} alt="INSIGHT" className="w-13 h-auto" />
            </Link>
          </li>
          <li>
            <Link
              aria-label="JOURNAL"
              href="/JOURNAL"
              className="cursor-pointer"
            >
              <img src={FileIcon.src} alt="JOURNAL" className="w-13 h-auto" />
            </Link>
          </li>
          <li aria-hidden="true" className="h-10 w-px mx-2 bg-foreground/40 " />
          <li>
            <a
              href="mailto:musamea99@gmail.com"
              aria-label="CONTACT"
              className="cursor-pointer"
            >
              <img src={MailIcon.src} alt="CONTACT" className="w-12 h-auto" />
            </a>
          </li>
          <li className="flex items-center ">
            <button aria-label="PHOTOBOOTH" className="cursor-pointer">
              <img
                src={PhotoboothIcon.src}
                alt="PHOTOBOOTH"
                className="w-12 h-auto"
              />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
