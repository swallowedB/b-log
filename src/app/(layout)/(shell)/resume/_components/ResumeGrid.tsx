import BlogCard from "./cards/BlogCard";
import CliCard from "./cards/CliCard";
import ExperienceCard from "./cards/ExperienceCard";
import ProfileCard from "./cards/ProfileCard";
import ShelfCard from "./cards/ShelfCard";
import StatsCard from "./cards/StatsCard";

export default function ResumeGrid() {
  return (
    <div className="relative flex h-[calc(100dvh-4rem)] min-h-0 justify-center overflow-hidden px-3 pb-8 pt-3 md:px-4 lg:px-6">
      <div className="min-h-0 w-full max-w-[1440px]">
        <div className="h-full min-h-0">
          <div className="hidden h-full md:grid md:grid-cols-[1.05fr_1fr_0.85fr_1.3fr] md:grid-rows-[0.78fr_1.14fr_0.7fr] md:gap-3">
            <ProfileCard animationDelay={0.02} className="col-start-1 row-start-1" />
            <StatsCard animationDelay={0.06} className="col-span-2 col-start-2 row-start-1" />
            <ExperienceCard animationDelay={0.1} className="col-start-4 row-span-2 row-start-1" />
            <CliCard animationDelay={0.14} className="col-span-2 col-start-1 row-span-2 row-start-2" />
            <ShelfCard animationDelay={0.18} className="col-start-3 row-start-2" />
            <BlogCard animationDelay={0.22} className="col-span-2 col-start-3 row-start-3" />
          </div>

          <div className="h-full space-y-3 overflow-y-auto pb-3 md:hidden">
            <ProfileCard animationDelay={0.02} />
            <StatsCard animationDelay={0.06} />
            <ExperienceCard animationDelay={0.1} />
            <CliCard animationDelay={0.14} />
            <ShelfCard animationDelay={0.18} />
            <BlogCard animationDelay={0.22} />
          </div>
        </div>
      </div>
    </div>
  );
}
