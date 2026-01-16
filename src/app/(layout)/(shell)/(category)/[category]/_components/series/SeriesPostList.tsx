import PostSection from "@/app/(layout)/(shell)/_components/posts/PostSection";
import SortSelectClient from "@/components/common/controls/sort/SortSelectClient";
import { CategoryKey } from "@/config/categories";
import { getSeriesMeta, PostSort, queryPosts } from "@/lib/posts";

interface Props {
  category: CategoryKey;
  series?: string;
  sort: PostSort;
  page: number;
  pageSize: number;
}

export default async function SeriesPostList({
  category,
  series,
  sort,
  page,
  pageSize,
}: Props) {
  const appliedSort: PostSort = sort === "popular" ? "popular" : "latest";

  const result = await queryPosts({
    category,
    series,
    sort: appliedSort,
    page,
    perPage: pageSize,
    includeDrafts: false,
    visiblePages: 5,
  });

  const seriesMeta = series ? getSeriesMeta(series, category) : null;

  return (
    <section id="series-post-section" className="mt-20 scroll-mt-24">
      <div>
        <div className="flex md:flex-col justify-between mb-2 md:mb-0 items-baseline w-full">
          <h2 className="text-3xl font-bold hidden md:block">
            {seriesMeta?.name ?? "모아보기"}
          </h2>

          <div className="flex items-center justify-end md:justify-between mb-5 md:mb-0 w-full">
            <span className="hidden md:block mt-3 text-sm text-foreground/60">
              {seriesMeta?.description ?? "모든 글들을 자유롭게 둘러보세요."}
            </span>
            <SortSelectClient value={result.applied.sort} />
          </div>
        </div>
        <PostSection
          posts={result.posts}
          pagination={result.pagination}
          pageRange={result.pageRange}
          cardSize="sm"
        />
      </div>
    </section>
  );
}
