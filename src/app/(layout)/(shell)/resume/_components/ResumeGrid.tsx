import BlogCard from "./cards/BlogCard";
import ExperienceCard from "./cards/ExperienceCard";
import ProfileCard from "./cards/ProfileCard";
import LearningShelfPreview from "./cards/LearningShelfPreview";
import type { LearningPreview } from "@/app/(layout)/(shell)/learning/_components/LearningCard";
import StatsCard from "./cards/StatsCard";

export default function ResumeGrid({ learning }: { learning: readonly LearningPreview[] }) {
  return (
    <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-4 px-3 pt-4 pb-24 sm:px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:px-6">
      <ProfileCard animationDelay={0.02} className="min-h-[13rem]" />
      <StatsCard animationDelay={0.06} />
      <ExperienceCard animationDelay={0.1} className="min-h-[19rem]" />
      <div className="grid min-w-0 gap-4 lg:grid-rows-[auto_1fr]">
        <BlogCard animationDelay={0.14} className="min-h-[11rem]" />
        <LearningShelfPreview entries={learning} animationDelay={0.18} className="min-h-[13rem]" />
      </div>
    </div>
  );
}
