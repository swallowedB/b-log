"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projectItems } from "../../_constants/resume.projects";
import ResumeCard from "../ResumeCard";
import type { ResumeCardSlotProps } from "./card.types";

const projectStatusLabel = {
  deployed: "Deployed",
  paused: "Paused",
} as const;

const projectStatusDotClass = {
  deployed: "text-blue",
  paused: "text-foreground/35",
} as const;

const projectStatusBadgeClass = {
  deployed: "border-blue/20 bg-blue/8 text-blue",
  paused: "border-foreground/10 bg-foreground/5 text-foreground/45",
} as const;

export default function BlogCard({ className, animationDelay }: ResumeCardSlotProps) {
  const scrollRef = useRef<HTMLElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollControls = () => {
    const element = scrollRef.current;

    if (!element) return;

    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    setCanScrollPrevious(element.scrollLeft > 1);
    setCanScrollNext(element.scrollLeft < maxScrollLeft - 1);
  };

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) return;

    updateScrollControls();
    element.addEventListener("scroll", updateScrollControls, { passive: true });
    window.addEventListener("resize", updateScrollControls);

    return () => {
      element.removeEventListener("scroll", updateScrollControls);
      window.removeEventListener("resize", updateScrollControls);
    };
  }, []);

  const scrollProjects = (direction: "previous" | "next") => {
    const element = scrollRef.current;

    if (!element) return;

    const cardWidth = (element.clientWidth - 24) / 3;
    const gap = 12;
    element.scrollBy({
      left: direction === "next" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
    window.setTimeout(updateScrollControls, 240);
  };

  return (
    <ResumeCard title="Projects" animationDelay={animationDelay} className={className}>
      <div className="flex h-full min-h-0 flex-col">
        <div className="relative min-h-0 flex-1">
          {canScrollPrevious ? (
            <button
              type="button"
              aria-label="Previous projects"
              onClick={() => scrollProjects("previous")}
              className="absolute left-0 top-1/2 z-20 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-foreground/50 transition hover:text-blue dark:text-white/50"
            >
              <ChevronLeft className="size-4" />
            </button>
          ) : null}

          <section
            ref={scrollRef}
            id="project"
            className="grid h-full auto-cols-[calc((100%-1.5rem)/3)] grid-flow-col items-stretch gap-3 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory scroll-mt-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {projectItems.map((project) => (
              <Link
                key={project.title}
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full min-w-0 snap-start flex-col justify-between rounded-md border border-slate-300/80 bg-slate-100/95 px-3.5 py-3 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.3)] transition hover:border-blue/35 dark:border-[#1a3148] dark:bg-[#102033]"
              >
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="min-w-0 line-clamp-1 text-xs font-semibold text-foreground">
                      {project.title}
                    </h3>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 ${projectStatusBadgeClass[project.status]}`}
                    >
                      <span className={`relative inline-flex size-1 items-center justify-center ${projectStatusDotClass[project.status]}`}>
                        {project.status === "deployed" ? (
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
                        ) : null}
                        <span className="relative inline-flex size-1 rounded-full bg-current" />
                      </span>
                      <span className="text-[7px] font-medium">
                        {projectStatusLabel[project.status]}
                      </span>
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-[9px] leading-4 text-foreground/52">
                    {project.note}
                  </p>
                </div>
              </Link>
            ))}
          </section>

          {canScrollNext ? (
            <button
              type="button"
              aria-label="Next projects"
              onClick={() => scrollProjects("next")}
              className="absolute right-0 top-1/2 z-20 flex size-6 -translate-y-1/2 translate-x-1/2 items-center justify-center text-foreground/50 transition hover:text-blue dark:text-white/50"
            >
              <ChevronRight className="size-4" />
            </button>
          ) : null}
        </div>
      </div>
    </ResumeCard>
  );
}
