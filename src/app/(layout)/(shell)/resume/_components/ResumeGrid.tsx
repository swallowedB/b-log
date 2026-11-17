import type { ResumeFAQ } from "@/lib/resume/types";
import BlogCard from "./cards/BlogCard";
import AskBoaCard from "./cards/AskBoaCard";
import ExperienceCard from "./cards/ExperienceCard";
import ProfileCard from "./cards/ProfileCard";
import LearningShelfPreview from "./cards/LearningShelfPreview";
import type { LearningPreview } from "@/app/(layout)/(shell)/learning/_components/LearningCard";
import StatsCard from "./cards/StatsCard";

export default function ResumeGrid({ faqs, learning }: { faqs: readonly ResumeFAQ[]; learning: readonly LearningPreview[] }) {
  return (
    <div className="relative flex h-[calc(100dvh-4rem)] min-h-0 justify-center overflow-hidden px-3 pb-8 pt-3 md:px-4 lg:px-6">
      <div className="grid h-full min-h-0 w-full max-w-[1440px] auto-rows-max grid-cols-1 gap-3 overflow-y-auto pb-3 lg:auto-rows-auto lg:grid-cols-[1.05fr_1fr_0.85fr_1.3fr] lg:grid-rows-[0.78fr_1.14fr_0.7fr] lg:overflow-visible lg:pb-0">
        <ProfileCard animationDelay={0.02} className="min-h-[240px] lg:col-start-1 lg:row-start-1 lg:min-h-0" />
        <StatsCard animationDelay={0.06} className="min-h-[260px] lg:col-span-2 lg:col-start-2 lg:row-start-1 lg:min-h-0" />
        <ExperienceCard animationDelay={0.1} className="min-h-[360px] lg:col-start-4 lg:row-span-2 lg:row-start-1 lg:min-h-0" />
        <AskBoaCard faqs={faqs} animationDelay={0.14} className="h-[520px] min-h-0 lg:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-2 lg:h-auto" />
        <LearningShelfPreview entries={learning} animationDelay={0.18} className="min-h-[230px] lg:col-start-3 lg:row-start-2 lg:min-h-0" />
        <BlogCard animationDelay={0.22} className="min-h-[180px] lg:col-span-2 lg:col-start-3 lg:row-start-3 lg:min-h-0" />
      </div>
    </div>
  );
}
