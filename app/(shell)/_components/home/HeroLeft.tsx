import { HERO_POPULAR_TAGS } from "../../_constants/home";
import SearchBar from "../ui/SearchBar";
import HeroTagList from "./HeroTagList";

interface HeroLeftProps {
  intro: string;
}

export default function HeroLeft({ intro }: HeroLeftProps) {
  return (
    <div className="flex-1 space-y-12">
      {/* 소개 타이틀/텍스트 */}
      <div className="space-y-3">
        <h1 className="text-xl font-black  md:text-[40px]">
          Like the Boa That
          <br />
          Swallowed an Elephant
        </h1>
        <p className="text-xs text-foreground/50 md:text-sm font-light whitespace-pre-line">
          {intro}
        </p>
      </div>

      <div className="pr-10">
        <SearchBar />
      </div>

      {/* 인기 태그 섹션 */}
      <div className="flex gap-3 items-center">
        <span className="text-xs md:text-base font-medium text-foreground/70">
          Trending :
        </span>
        <HeroTagList tags={HERO_POPULAR_TAGS} />
      </div>
    </div>
  );
}
