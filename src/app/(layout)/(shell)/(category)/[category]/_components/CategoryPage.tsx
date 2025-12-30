import CategoryHeader from "@/app/(layout)/(shell)/(category)/[category]/_components/CategoryHeader";
import CategorySeries from "@/app/(layout)/(shell)/(category)/[category]/_components/CategorySeries";
import CategoryWidget from "@/app/(layout)/(shell)/(category)/[category]/_components/CategoryWidget";
import { CategoryConfig } from "@/app/(layout)/(shell)/(category)/_constants/category.config";
import { SearchParams } from "@/types/route.types";

interface CategoryPageProps {
  config: CategoryConfig;
  searchParams: SearchParams;
}

export default function CategoryPage({
  config,
  searchParams,
}: CategoryPageProps) {
  const series =
    typeof searchParams.series === "string" ? searchParams.series : undefined;
  const sortParam =
    typeof searchParams.sort === "string" ? searchParams.sort : "latest";
  const sort = sortParam === "popular" ? "popular" : "latest";
  const pageParam = Number(
    typeof searchParams.page === "string" ? searchParams.page : 1
  );
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  return (
    <main className="w-full">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 pb-24 lg:max-w-[1560px]">
        <CategoryHeader title={config.title} description={config.description} />
        <CategoryWidget category={config.label} />
        <CategorySeries
          category={config.id}
          series={series}
          sort={sort}
          page={page}
        />
      </div>
    </main>
  );
}
