"use client";

import { useEffect, useState } from "react";
import { cliSection } from "../../_constants/resume.data";
import ResumeCard from "../ResumeCard";
import type { ResumeCardSlotProps } from "./card.types";

const typingSpeed = 18;
const cliLineStartIndexes = cliSection.lines.map((_, index) =>
  cliSection.lines
    .slice(0, index)
    .reduce((total, line) => total + line.length, 0),
);
const cliTotalCharacters = cliSection.lines.reduce(
  (total, line) => total + line.length,
  0,
);

export default function CliCard({ className, animationDelay }: ResumeCardSlotProps) {
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setVisibleCharacters((current) => {
        if (current >= cliTotalCharacters) {
          window.clearInterval(intervalId);
          return current;
        }

        return current + 1;
      });
    }, typingSpeed);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <ResumeCard
      padded={false}
      accent={false}
      animationDelay={animationDelay}
      className={`border-[#1a3148] bg-[#07111d] shadow-[0_22px_48px_-34px_rgba(2,6,23,0.9)] ${className ?? ""}`}
    >
      <section
        id="cli"
        className="flex h-full flex-col overflow-hidden scroll-mt-24 bg-[radial-gradient(circle_at_18%_0%,rgba(14,165,233,0.16),transparent_30%),linear-gradient(180deg,#0a1726_0%,#07111d_45%,#050b14_100%)]"
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-3 py-2 shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)]">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#ff5f56]" />
            <span className="size-1.5 rounded-full bg-[#ffbd2e]" />
            <span className="size-1.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            {cliSection.terminalPath}
          </span>
          <span aria-hidden className="w-[2.625rem]" />
        </div>

        <div className="flex-1 space-y-2 overflow-hidden px-4 py-3 font-mono text-[12px] leading-6 text-slate-200">
          {cliSection.lines.map((line, index) => {
            const visibleLineLength = Math.min(
              line.length,
              Math.max(0, visibleCharacters - cliLineStartIndexes[index]),
            );
            const visibleLine = line.slice(0, visibleLineLength);

            return (
              <p
                key={line}
                className={line.startsWith("$") ? "min-h-6 text-blue-300" : "min-h-6 text-slate-300/88"}
              >
                {visibleLine}
              </p>
            );
          })}
          <div className="flex min-h-6 items-center gap-1 text-blue-300">
            <span>{visibleCharacters >= cliTotalCharacters ? "$" : ""}</span>
            <span className="h-4 w-1.5 animate-pulse rounded-[1px] bg-blue-300" />
          </div>
        </div>
      </section>
    </ResumeCard>
  );
}
