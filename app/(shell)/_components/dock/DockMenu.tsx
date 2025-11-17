import Link from "next/link";

export default function DockMenu() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <nav 
      aria-label="Dock menu"
      className="pointer-events-auto absolute bottom-10 left-1/2 -translate-x-1/2
                bg-foreground/10 text-foreground px-10 py-3 rounded-3xl"
      >
        <ul className="flex items-center gap-10">
          <li>
            <Link aria-label="DEV_LOG" href="/DEV_LOG">
              DEV_LOG
            </Link>
          </li>
          <li>
            <Link aria-label="INSIGHT" href="/INSIGHT">
              INSIGHT
            </Link>
          </li>
          <li>
            <Link aria-label="JOURNAL" href="/JOURNAL">
              JOURNAL
            </Link>
          </li>
          <li aria-hidden="true" className="h-4 w-px bg-gray-300 mx-2" />
          <li>
            <a href="mailto:musamea99@gmail.com" aria-label="CONTACT">
              Contact
            </a>
          </li>
          <li>
            <button aria-label="PHOTOBOOTH">
              Photo
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
