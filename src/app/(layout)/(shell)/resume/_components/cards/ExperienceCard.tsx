import { educationItems, experienceItems } from "../../_constants/resume.data";
import ExperienceTabs from "../ExperienceTabs";
import ResumeCard from "../ResumeCard";
import type { ResumeCardSlotProps } from "./card.types";

export default function ExperienceCard({ className, animationDelay }: ResumeCardSlotProps) {
  return (
    <ResumeCard animationDelay={animationDelay} className={className}>
      <ExperienceTabs experiences={experienceItems} education={educationItems} />
    </ResumeCard>
  );
}
