"use client";

import * as React from "react";
import type { HTMLAttributes, ReactNode } from "react";

type FigureProps = HTMLAttributes<HTMLElement> & {
  [key: string]: unknown;
};

function isElement(
  node: ReactNode
): node is React.ReactElement<Record<string, unknown>> {
  return React.isValidElement(node);
}

function getText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getText).join("");
  if (isElement(node)) return getText(node.props.children as ReactNode);
  return "";
}

function cx(...v: Array<string | undefined | false | null>) {
  return v.filter(Boolean).join(" ");
}

export default function CodeBlockFigure({
  className,
  children,
  ...props
}: FigureProps) {
  const figureRef = React.useRef<HTMLElement | null>(null);
  const preRef = React.useRef<HTMLPreElement | null>(null);

  const [copied, setCopied] = React.useState(false);
  const [lineCount, setLineCount] = React.useState(1);

  const childArray = React.Children.toArray(children) as ReactNode[];

  const figcaptionEl = childArray.find(
    (n) => isElement(n) && n.type === "figcaption"
  ) as React.ReactElement<Record<string, unknown>> | undefined;

  const preEl = childArray.find(
    (n) => isElement(n) && n.type === "pre"
  ) as React.ReactElement<Record<string, unknown>> | undefined;

  const title = figcaptionEl
    ? getText(figcaptionEl.props.children as ReactNode).trim()
    : "";

  const preProps = (preEl?.props ?? {}) as Record<string, unknown>;
  const langRaw = (preProps["data-language"] as string | undefined) ?? "";
  const lang = (langRaw || "txt").toLowerCase();

  React.useEffect(() => {
    const root = figureRef.current;
    if (!root) return;

    const pre = root.querySelector("pre");
    preRef.current = pre instanceof HTMLPreElement ? pre : null;

    const text = (preRef.current?.textContent ?? "").replace(/\n$/, "");
    setLineCount(Math.max(1, text ? text.split("\n").length : 1));
  }, [children]);

  const handleCopy = async () => {
    const pre = preRef.current;
    if (!pre) return;

    const text = (pre.textContent ?? "").replace(/\n$/, "");
    if (!text.trim()) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <figure
      ref={figureRef}
      data-rehype-pretty-code-figure=""
      className={cx(
        "not-prose my-6 overflow-hidden rounded-xl border border-[#2d3139] bg-[#1e2127]",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 border-b border-[#2d3139] bg-[#21252b] px-4 py-1">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-gray-400/50" />
          <span className="h-2 w-2 rounded-full bg-gray-400/50" />
          <span className="h-2 w-2 rounded-full bg-gray-400/50" />
        </div>

        <div className="ml-3 flex items-center gap-2 text-xs">
          <span className="rounded text-xs text-[#abb2bf]">
            {title || lang}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="ml-auto rounded-md px-2.5 py-1 text-[10px] text-[#abb2bf] transition hover:bg-white/10 hover:text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="flex">
        <div className="select-none border-r border-[#2d3139] px-3 py-4 text-right font-mono text-xs leading-5 text-[#495162]">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="h-5 leading-5">{i + 1}</div>
          ))}
        </div>

        <div className="flex-1 min-w-0 p-4 ">
          {figcaptionEl ? (
            <figcaption className="sr-only" data-rehype-pretty-code-title="">
              {figcaptionEl.props.children as ReactNode}
            </figcaption>
          ) : null}
          {preEl ?? null}
        </div>
      </div>
    </figure>
  );
}
