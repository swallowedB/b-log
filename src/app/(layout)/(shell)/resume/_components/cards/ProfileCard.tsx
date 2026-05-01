import ProfileHeroCard from "../ProfileHeroCard";
import ResumeCard from "../ResumeCard";
import type { ResumeCardSlotProps } from "./card.types";

export default function ProfileCard({ className, animationDelay }: ResumeCardSlotProps) {
  return (
    <ResumeCard padded={false} animationDelay={animationDelay} className={className}>
      <ProfileHeroCard />
    </ResumeCard>
  );
}
