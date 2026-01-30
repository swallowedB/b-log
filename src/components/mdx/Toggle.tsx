import clsx from "clsx";
import { ChevronDown, Info } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

type ToggleTone = "default" | "blue";

const tonePreset: Record<
  ToggleTone,
  { border: string; hover: string; text: string; summaryBg: string }
> = {
  default: {
    border: "border-neutral-200 dark:border-white/10",
    hover: "hover:bg-neutral-50/80 dark:hover:bg-white/[0.04]",
    text: "text-neutral-900/90 dark:text-white/90",
    summaryBg: "bg-transparent",
  },
  blue: {
    border: "border-sky-200/70 dark:border-white/10",
    hover: "hover:bg-sky-50/70 dark:hover:bg-white/[0.04]",
    text: "text-[#0a1f47]/90 dark:text-white/90",
    summaryBg: "bg-sky-50/30 dark:bg-sky-400/5",
  },
};

export default function Toggle({
  title,
  children,
  tone = "default",
  defaultOpen = false,
  dense = false,
  className,
  ...rest
}: {
  title: ReactNode;
  children: ReactNode;
  tone?: ToggleTone;
  defaultOpen?: boolean;
  dense?: boolean;
} & HTMLAttributes<HTMLDetailsElement>) {
  const t = tonePreset[tone];

  return (
    <details
      open={defaultOpen}
      className={clsx("my-4 w-full text-sm", className)}
      {...rest}
    >
      <summary
        className={clsx(
          "cursor-pointer list-none select-none",
          "rounded-md border",
          t.border,
          t.summaryBg,
          t.hover,
          dense ? "px-2 py-1.5" : "px-3 py-2"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={clsx(
                "flex h-5 w-5 items-center justify-center rounded"
              )}
              aria-hidden
            >
              <Info strokeWidth={2} />
            </span>

            <div
              className={clsx(
                "min-w-0 flex-1 text-left font-semibold text-lg",
                t.text
              )}
            >
              {title}
            </div>
          </div>
          <span className="transition-transform duration-200 group-open:rotate-180">
            <ChevronDown />
          </span>
        </div>
      </summary>

      <div className={clsx("mx-2", dense ? "pt-2" : "pt-3")}>
        <div
          className={clsx(
            "rounded-md border",
            t.border,
            "bg-neutral-50/50 dark:bg-white/3",
            dense ? "px-10 py-2" : "px-10 py-2.5",
            "text-neutral-800 dark:text-white/80",
            "leading-relaxed"
          )}
        >
          {children}
        </div>
      </div>
    </details>
  );
}
