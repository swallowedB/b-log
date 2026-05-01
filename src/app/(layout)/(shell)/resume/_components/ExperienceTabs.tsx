"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpenCheck,
  CalendarDays,
  Code2,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { experienceSection } from "../_constants/resume.data";
import {
  experiencePanelClass,
  experienceStackChipClass,
} from "../_constants/resume.styles";
import type { ResumeTimelineItem } from "../_constants/resume.types";

type ExperienceTabsProps = {
  experiences: readonly ResumeTimelineItem[];
  education: readonly ResumeTimelineItem[];
};

export default function ExperienceTabs({
  experiences,
  education,
}: ExperienceTabsProps) {
  const [tab, setTab] = useState<"experience" | "education">("education");
  const items = tab === "experience" ? experiences : education;

  return (
    <section className="flex h-full min-h-0 flex-col gap-2 scroll-mt-24" id="experience">
      <div className="flex items-center justify-between gap-3">
        <div className="relative inline-grid grid-cols-2 items-center rounded-[14px] bg-white/80 p-1 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.28)] dark:bg-white/4">
          <motion.span
            aria-hidden
            className="absolute bottom-1 top-1 z-0 rounded-[10px] bg-blue/92 shadow-[0_10px_18px_-14px_rgba(14,165,233,0.75)]"
            animate={{ x: tab === "experience" ? "0%" : "100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            style={{
              left: "0.25rem",
              width: "calc((100% - 0.5rem) / 2)",
            }}
          />
          <button
            type="button"
            onClick={() => setTab("experience")}
            className={`relative z-10 cursor-pointer rounded-[10px] px-3 py-1 text-[10px] font-medium transition-colors ${
              tab === "experience"
                ? "text-white"
                : "bg-transparent text-foreground/56 hover:text-foreground dark:text-white/58 dark:hover:text-white"
            }`}
          >
            {experienceSection.tabs.experience}
          </button>
          <button
            type="button"
            onClick={() => setTab("education")}
            className={`relative z-10 cursor-pointer rounded-[10px] px-3 py-1 text-[10px] font-medium transition-colors ${
              tab === "education"
                ? "text-white"
                : "bg-transparent text-foreground/56 hover:text-foreground dark:text-white/58 dark:hover:text-white"
            }`}
          >
            {experienceSection.tabs.education}
          </button>
        </div>
      </div>

      <div className="mt-2 min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="relative pl-10">
          <div
            aria-hidden
            className="absolute bottom-0 left-3.5 top-0 w-px bg-linear-to-b from-blue/10 via-blue/28 to-blue/8"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              className="space-y-2.5"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 1 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.06 },
                },
                exit: {
                  opacity: 0,
                  transition: { duration: 0.12 },
                },
              }}
            >
              {items.map((item) => {
                const [period, location] = item.periodLocation
                  ? item.periodLocation.split("|").map((value) => value.trim())
                  : [];
                const isUniversity = item.kind === "university";
                const heading = isUniversity && item.major ? item.major : item.title;
                const subheading = isUniversity
                  ? item.title
                  : item.organizer ?? item.company;

                return (
                  <motion.div
                    key={item.title}
                    className="relative"
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 360,
                          damping: 30,
                        },
                      },
                      exit: {
                        opacity: 0,
                        y: -8,
                        transition: { duration: 0.12 },
                      },
                    }}
                  >
                  <div className="absolute left-[-2.5rem] top-4 z-10 flex size-7 items-center justify-center rounded-xl border border-blue/25 bg-slate-50 text-blue shadow-[0_10px_24px_-16px_rgba(14,165,233,0.55)] dark:border-blue/30 dark:bg-[#0e1c2d]">
                    {item.kind === "university" ? (
                      <GraduationCap className="size-3.5" />
                    ) : item.kind === "program" ? (
                      <BookOpenCheck className="size-3.5" />
                    ) : (
                      <Code2 className="size-3.5" />
                    )}
                  </div>

                  <article className={experiencePanelClass}>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="min-w-0 text-xs font-semibold text-foreground">
                          {heading}
                        </h3>
                        {item.isCurrent ? (
                          <span className="shrink-0 rounded-full border border-blue/45 bg-blue/10 px-1.5 py-0.5 text-[7px] font-semibold text-blue dark:bg-blue/14">
                            Current
                          </span>
                        ) : null}
                      </div>
                      {subheading ? (
                        <p className="mt-1 text-[10px] font-medium text-blue">
                          {subheading}
                        </p>
                      ) : null}
                      {item.periodLocation ? (
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[8px] text-foreground/50">
                          {period ? (
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="size-2.5 text-blue/80" />
                              <span>{period}</span>
                            </span>
                          ) : null}
                          {location ? (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="size-2.5 text-blue/80" />
                              <span>{location}</span>
                            </span>
                          ) : null}
                        </div>
                      ) : item.meta ? (
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[8px] text-foreground/50">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="size-2.5 text-blue/80" />
                            <span>{item.meta}</span>
                          </span>
                          {isUniversity && item.gpa ? (
                            <span className="font-mono font-medium text-blue/80">
                              GPA {item.gpa}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                      {item.techStack?.length ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {item.techStack.map((tech) => (
                            <span key={tech} className={experienceStackChipClass}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      ) : isUniversity && item.doubleMajor ? (
                        <p className="mt-2 text-[10px] leading-[1.55] text-foreground/68">
                          Double Major in {item.doubleMajor}
                        </p>
                      ) : isUniversity && item.degree ? (
                        <p className="mt-2 text-[10px] leading-[1.55] text-foreground/68">
                          {item.degree}
                        </p>
                      ) : null}
                      {item.descriptionItems?.length ? (
                        <ul className="mt-2 space-y-1 text-[10px] leading-[1.55] text-foreground/68">
                          {item.descriptionItems.map((description) => (
                            <li key={description} className="flex gap-1.5">
                              <span className="mt-[0.55em] size-1 shrink-0 rounded-full bg-blue/70" />
                              <span>{description}</span>
                            </li>
                          ))}
                        </ul>
                      ) : item.description ? (
                        <p className="mt-2 text-[10px] leading-[1.55] text-foreground/68">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </article>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
