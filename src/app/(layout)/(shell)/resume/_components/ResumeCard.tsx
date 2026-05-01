"use client";

import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface ResumeCardProps {
  title?: string;
  eyebrow?: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  padded?: boolean;
  accent?: boolean;
  animationDelay?: number;
  children: ReactNode;
}

export default function ResumeCard({
  title,
  eyebrow,
  description,
  icon,
  className,
  padded = true,
  accent = true,
  animationDelay = 0,
  children,
}: ResumeCardProps) {
  const hasHeader = Boolean(eyebrow || title || description || icon);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: animationDelay,
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={clsx(
        "relative h-full overflow-hidden rounded-xl border border-slate-200/85 bg-white/90 shadow-[0_18px_44px_-38px_rgba(15,23,42,0.32)]",
        "dark:border-white/10 dark:bg-[#0a1321]/84 dark:shadow-[0_20px_44px_-38px_rgba(2,6,23,0.88)]",
        padded ? "p-3 sm:p-4" : "p-0",
        className,
      )}
    >
      {accent ? (
        <>
          <div
            aria-hidden
            className={clsx(
              "pointer-events-none absolute inset-x-0 top-0 h-px",
              "bg-linear-to-r from-transparent via-blue/55 to-transparent",
            )}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 top-0 h-24 w-24 rounded-full bg-blue/10 blur-2xl dark:bg-blue/14"
          />
        </>
      ) : null}

      <div className="relative z-10 flex h-full flex-col">
        {hasHeader ? (
          <header className="mb-3 flex items-start justify-between gap-3">
            <div className="space-y-1">
              {eyebrow ? (
                <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-blue/80 uppercase dark:text-blue/75">
                  {eyebrow}
                </p>
              ) : null}
              {title ? (
                <h2 className="text-[15px] font-semibold text-foreground sm:text-base">{title}</h2>
              ) : null}
              {description ? (
                <p className="text-[11px] leading-5 text-foreground/62 sm:text-xs">
                  {description}
                </p>
              ) : null}
            </div>
            {icon ? (
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200/85 bg-slate-50/90 text-foreground/72 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/72">
                {icon}
              </div>
            ) : null}
          </header>
        ) : null}
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </motion.section>
  );
}
