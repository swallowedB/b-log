import ActivityCasesCard, { type ActivityCasePreview } from "./cards/ActivityCasesCard";
import BadgeCard from "./cards/BadgeCard";
import ExperienceCard from "./cards/ExperienceCard";
import ProfileCard from "./cards/ProfileCard";
import LearningShelfPreview from "./cards/LearningShelfPreview";
import type { LearningPreview } from "@/app/(layout)/(shell)/learning/_components/LearningCard";
import StatsCard from "./cards/StatsCard";

export default function ResumeGrid({ learning, cases }: {
  learning: readonly LearningPreview[];
  cases: readonly ActivityCasePreview[];
}) {
  return (
    <div className="mx-auto grid w-full max-w-[1480px] grid-cols-1 gap-4 px-3 pt-4 pb-24 sm:px-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.32fr)_minmax(0,1fr)] lg:px-6">
      <div className="flex min-w-0 flex-col gap-4">
        <ProfileCard animationDelay={0.02} className="min-h-[12rem]" />
        <StatsCard animationDelay={0.06} className="grow" />
      </div>
      <div className="flex min-w-0 flex-col justify-between gap-4">
        <LearningShelfPreview entries={learning} animationDelay={0.1} className="lg:grow" />
        <ActivityCasesCard entries={cases} animationDelay={0.14} className="lg:grow" />
        <BadgeCard animationDelay={0.18} className="lg:grow" />
      </div>
      <ExperienceCard animationDelay={0.22} className="min-h-[19rem] min-w-0" />
    </div>
  );
}
