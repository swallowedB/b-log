import { HERO_INTRO } from "../../_constants/home";
import HeroLeft from "./HeroLeft";
import HeroRightMedia from "./HeroRightMedia";

export default function Hero() {
  return (
    <section className="relative mx-auto px-5 md:px-0 flex flex-col gap-20 md:py-15 md:flex-row md:items-center md:justify-between ">
      <HeroLeft intro={HERO_INTRO} />
      <HeroRightMedia />
    </section>
  );
}
