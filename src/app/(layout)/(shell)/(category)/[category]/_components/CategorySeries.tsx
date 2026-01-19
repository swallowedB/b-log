import CategorySeriesCarousel from "@/app/(layout)/(shell)/(category)/[category]/_components/CategorySeriesCarousel";
import SeriesPostList from "@/app/(layout)/(shell)/(category)/[category]/_components/series/SeriesPostList";
import { FolderTone } from "@/components/common/icons/FolderIcon";
import { CategoryKey } from "@/config/categories";
import { getAllPosts, getSeriesListByCategory, PostSort } from "@/lib/posts";

export interface SeriesItem {
  id: string;
  name: string;
  description: string;
  category: string;
  postCount: number;
  tone: FolderTone;
}

interface Props {
  category: CategoryKey;
  series?: string;
  sort: PostSort;
  page: number;
}

const VISIBLE_COUNT = 4;

export default function CategorySeries({
  category,
  series,
  sort,
  page,
}: Props) {
  const seriesMetas = getSeriesListByCategory(category);

  const posts = getAllPosts({ includeDrafts: false }).filter(
    (p) => p.category === category
  );

  const postCountBySeries = posts.reduce<Record<string, number>>((acc, p) => {
    if (!p.series) return acc;
    acc[p.series] = (acc[p.series] ?? 0) + 1;
    return acc;
  }, {});

  const seriesItems: SeriesItem[] = seriesMetas.map((m) => ({
    id: m.id,
    name: m.name,
    description: m.description,
    category: m.category,
    tone: m.tone ?? "gray",
    postCount: postCountBySeries[m.id] ?? 0,
  }));

  return (
    <section className="max-w-full mt-4">
      <div className="hidden md:block w-full">
        {seriesItems.length > 0 && (
          <CategorySeriesCarousel
            items={seriesItems}
            visibleCount={VISIBLE_COUNT}
          />
        )}
      </div>
      <SeriesPostList
        category={category}
        series={series}
        sort={sort}
        page={page}
        pageSize={16}
      />
    </section>
  );
}
