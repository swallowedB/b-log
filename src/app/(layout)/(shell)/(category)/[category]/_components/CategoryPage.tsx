import CategoryBanner from "@/app/(layout)/(shell)/(category)/[category]/_components/CategoryBanner";
import CategoryHeader from "@/app/(layout)/(shell)/(category)/[category]/_components/CategoryHeader";
import CategorySeries from "@/app/(layout)/(shell)/(category)/[category]/_components/CategorySeries";
import CategoryWidget from "@/app/(layout)/(shell)/(category)/[category]/_components/CategoryWidget";
import SeriesFolder from "@/app/(layout)/(shell)/(category)/[category]/_components/series/SeriesFolder";
import { CategoryId } from "@/app/(layout)/(shell)/(category)/_constants/category.Config";

interface CategoryPageProps {
  category: CategoryId;
  config: {
    slug: string;
    id: string;
    title: string;
    description: string;
  };
}

export default function CategoryPage({ category, config }: CategoryPageProps) {
  return (
    <main className="w-full">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 pb-24 lg:max-w-[1560px]">
        <CategoryHeader title={config.title} description={config.description} />
        <CategoryWidget />
        <CategoryBanner
          categoryLabel="DEV_LOG"
          date="2025.11.10"
          title="#4. 나의 Dev-Log : 트러블슈팅_헥사곤 그리드 배치"
          excerpt="헥사곤 그리드 배치에서 SSR과 클라이언트 렌더링 사이의 미묘한 갭 때문에 정렬이 계속 틀어지던 이슈를 정리한 글입니다. 어떤 식으로 상태를 분리했고, 성능까지 챙긴 리팩터링 과정을 담았습니다."
          tags={["React", "TypeScript", "TailwindCSS"]}
        />
        <CategorySeries />

      </div>
    </main>
  );
}
