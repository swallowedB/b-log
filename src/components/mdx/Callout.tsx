import clsx from "clsx";
import type { ReactNode } from "react";

type CalloutType = "info" | "warning" | "block" | "qa";

const typePreset: Record<
  CalloutType,
  {
    container: string;
    text: string;
    defaultIcon: string;
    defaultTitle: string;
  }
> = {
  info: {
    container: "bg-gray-100 dark:bg-slate-600/30",
    text: "text-slate-900 dark:text-slate-100",
    defaultIcon: "📎",
    defaultTitle: "Info",
  },
  warning: {
    container: "bg-[#faeaeadf] dark:bg-accent/20",
    text: "text-slate-900 dark:text-slate-100",
    defaultIcon: "⛔️",
    defaultTitle: "문제점",
  },
  block: {
    container: "border border-gray-300 dark:border-slate-700",
    text: "text-slate-900 dark:text-slate-100",
    defaultIcon: "✅",
    defaultTitle: "Block",
  },
  qa: {
    container: "bg-blue/10 dark:bg-muted/20",
    text: "text-slate-900 dark:text-slate-100",
    defaultIcon: "🤔",
    defaultTitle: "Q&A",
  },
};

const mdxReset = clsx(
  "text-sm leading-6",

  // ---- 리스트: 과도한 들여쓰기/여백 제거 + 불렛 색상 통일 ----
  "[&_ul]:my-2 [&_ul]:ml-0 [&_ul]:pl-4 [&_ul]:list-disc",
  "[&_ol]:my-2 [&_ol]:ml-0 [&_ol]:pl-4 [&_ol]:list-decimal",
  "[&_li]:my-1",
  "[&_li::marker]:text-current", 
  "[&_li::marker]:opacity-90",

  // ---- 문단/헤딩:---
  "[&_p]:my-2",
  "[&_h1]:my-2 [&_h2]:my-2 [&_h3]:my-2",

  // ---- 첫/마지막 요소 간격 정리 ----
  "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",

  // ---- 인라인 코드/링크 기본 스타일 ----
  "[&_code]:rounded [&_code]:bg-black/5 [&_code]:px-1 [&_code]:py-0.5 dark:[&_code]:bg-white/10",
  "[&_a]:underline [&_a]:underline-offset-2"
);


export default function Callout({
  type = "block",
  icon,
  title,
  children,
  className,
}: {
  type?: CalloutType;
  icon?: ReactNode;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const p =
    type && type in typePreset
      ? typePreset[type]
      : typePreset.block;

  return (
    <aside
      className={clsx(
        "my-6 flex gap-3 rounded-md px-4 py-3.5",
        p.container,
        p.text,
        className
      )}
    >
      <div className="select-none">
        {icon ?? p.defaultIcon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-3 font-semibold text-lg ">
          {title ?? p.defaultTitle}
        </div>

        <div
          className={mdxReset}
        >
          {children}
        </div>
      </div>
    </aside>
  );
}
