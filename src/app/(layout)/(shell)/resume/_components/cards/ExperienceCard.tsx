import { educationItems, experienceItems } from "../../_constants/resume.data";
import ExperienceTabs from "../ExperienceTabs";
import ResumeCard from "../ResumeCard";
import type { ResumeCardSlotProps } from "./card.types";

export default function ExperienceCard({ className, animationDelay }: ResumeCardSlotProps) {
  return (
    <ResumeCard title="경력 및 교육" animationDelay={animationDelay} className={className}>
      <ExperienceTabs experiences={experienceItems} education={educationItems} />
    </ResumeCard>
  );
}
