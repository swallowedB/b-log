import { HERO_INTRO } from "../../_constants/home";
import HeroLeft from "./HeroLeft";
import HeroRightMedia from "./HeroRightMedia";

export default function Hero() {
  return (
    <section className="relative mx-auto flex flex-col gap-20 px-4 md:py-20 md:flex-row md:items-center md:justify-between md:px-15">
      <HeroLeft intro={HERO_INTRO} />
      <HeroRightMedia />
    </section>
  );
}
