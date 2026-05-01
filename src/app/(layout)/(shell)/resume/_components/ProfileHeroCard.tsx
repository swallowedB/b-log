"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { profileHeroContent } from "../_constants/resume.data";

export default function ProfileHeroCard() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentRole = profileHeroContent.roles[roleIndex];

    if (isTyping) {
      if (displayText.length < currentRole.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        }, 80);

        return () => clearTimeout(timeout);
      }

      const timeout = setTimeout(() => {
        setIsTyping(false);
      }, 1800);

      return () => clearTimeout(timeout);
    }

    if (displayText.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1));
      }, 40);

      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setRoleIndex((prev) => (prev + 1) % profileHeroContent.roles.length);
      setIsTyping(true);
    }, 180);

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, roleIndex]);

  return (
    <section
      id="profile"
      className="relative flex h-full flex-col overflow-hidden scroll-mt-24"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-br from-blue/6 via-transparent to-blue/10"
      />
      <div
        aria-hidden
        className="absolute right-0 top-0 h-52 w-52 translate-x-1/3 -translate-y-1/2 rounded-full bg-blue/12 blur-3xl"
      />

      <div className="relative z-10 flex h-full flex-col p-3 sm:p-3.5">
        <div className="flex min-h-0 flex-1 flex-col gap-1">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="shrink-0"
          >
            <span className="inline-flex items-center gap-1 rounded-full border border-blue/20 bg-blue/8 px-2 py-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue" />
              </span>
              <span className="text-[9px] font-medium text-blue">
                {profileHeroContent.availabilityLabel}
              </span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="pl-1 shrink-0"
          >
            <h1 className="mt-3 text-base font-bold leading-tight sm:text-lg lg:text-xl xl:text-2xl">
              <span className="text-foreground">{`${profileHeroContent.greetingPrefix} `}</span>
              <span className="text-blue">{profileHeroContent.name}</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="pl-1 shrink-0"
          >
            <p className="font-mono text-[10px] text-foreground/58 sm:text-[11px]">
              <span className="text-blue">&gt;</span>{" "}
              <span className="text-foreground">{displayText}</span>
              <span className="ml-0.5 inline-block h-3 w-0.5 animate-cursor-blink bg-blue align-middle sm:h-3.5" />
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-5 pl-1 shrink-0 flex flex-col gap-0.5 text-[10px] text-foreground/58 sm:text-[11px]"
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 shrink-0 text-blue" />
              <span>{profileHeroContent.location}</span>
            </span>

            <a
              href={`mailto:${profileHeroContent.email}`}
              className="flex min-w-0 items-center gap-1.5 transition-colors hover:text-blue"
            >
              <Mail className="h-3 w-3 shrink-0 text-blue" />
              <span className="truncate">{profileHeroContent.email}</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
