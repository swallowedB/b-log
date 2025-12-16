import clsx from "clsx";

type TocItem = { id: string; text: string; level: 2 | 3 };

export default function PostToc({ items }: { items: TocItem[] }) {
  return (
    <>
      <h2 className="mb-3 text-sm font-semibold text-foreground/60 dark:text-neutral-100">
        목차
      </h2>

      <nav className="relative">
        <span className="pointer-events-none absolute left-0 top-0 h-full w-px bg-neutral-200 dark:bg-neutral-700" />

        <div className="space-y-0.5">
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              className={clsx(
                "group relative block rounded-md py-2 pr-2 text-sm transition-colors",
                "text-neutral-600 hover:text-darkblue",
                "dark:text-neutral-400 dark:hover:text-blue",
                it.level === 3 ? "pl-6" : "pl-3",
              )}
            >
              <span
                className={clsx(
                  "pointer-events-none absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full",
                  "bg-darkblue opacity-0 transition-all group-hover:opacity-100",
                  "dark:bg-blue-400",
                )}
              />

              <span className="pointer-events-none absolute inset-0 rounded-md bg-blue-500/0 transition-colors group-hover:bg-blue-500/5 dark:group-hover:bg-white/5" />

              <span className="relative block truncate">{it.text}</span>
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
