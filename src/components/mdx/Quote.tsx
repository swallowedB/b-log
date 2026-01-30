import clsx from "clsx";
import type { ReactNode } from "react";

type QuoteTone = "black" | "green" | "blue" | "pink";

const tonePreset: Record<
  QuoteTone,
  {
    bar: string;
    text: string;
    bg: string;
    marker: string;
  }
> = {
  black: {
    bar: "bg-neutral-400",
    text: "text-gray-700 dark:text-neutral-100/90",
    bg: "dark:bg-neutral-300/10",
    marker: "marker:text-neutral-500 dark:marker:text-white/70",
  },
  green: {
    bar: "bg-emerald-400",
    text: "text-gray-800 dark:text-emerald-50",
    bg: "bg-gray-100 dark:bg-gray-500/10",
    marker: "marker:text-emerald-500 dark:marker:text-white/70",
  },
  blue: {
    bar: "bg-blue dark:bg-muted",
    text: "text-[#0a1f47] dark:text-sky-50",
    bg: "bg-blue-200/10 dark:bg-sky-950/40",
    marker: "marker:text-sky-600/50 dark:marker:text-white/70",
  },
  pink: {
    bar: "bg-accent",
    text: "text-[#4f0e32] dark:text-white",
    bg: "bg-accent/5 dark:bg-accent/10",
    marker: "marker:text-accent dark:marker:text-white/70",
  },
};

export default function Quote({
  tone = "black",
  children,
  className,
}: {
  tone?: QuoteTone;
  children: ReactNode;
  className?: string;
}) {
  const t = tonePreset[tone];

  return (
    <blockquote
      className={clsx(
        "border-0 pl-0 ml-0 not-italic",
        "my-6",
        "font-normal text-sm ",
        "quotes-none before:content-none after:content-none"
      )}
    >
      <div
        className={clsx("relative overflow-hidden", t.bg, t.text, className)}
      >
        <div className={clsx("absolute left-0 top-0 h-full w-1", t.bar)} />
        <div className="pl-6 pr-5 leading-snug wrap-break-word">
          {children}
        </div>
      </div>
    </blockquote>
  );
}
