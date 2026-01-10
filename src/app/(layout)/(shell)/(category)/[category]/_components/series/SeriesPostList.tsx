import PostSection from "@/app/(layout)/(shell)/_components/posts/PostSection";
import SortSelectClient from "@/components/common/controls/sort/SortSelectClient";
import { getSeriesMeta, PostSort, queryPosts } from "@/lib/posts";

interface Props {
  category: string;
  series?: string;
  sort: PostSort;
  page: number;
  pageSize: number;
}

export default function SeriesPostList({
  category,
  series,
  sort,
  page,
  pageSize,
}: Props) {
  const appliedSort: PostSort = sort === "popular" ? "popular" : "latest";

  const result = queryPosts({
    category,
    series,
    sort: appliedSort,
    page,
    perPage: pageSize,
    includeDrafts: false,
    visiblePages: 5,
  });

  const seriesMeta = series ? getSeriesMeta(series) : null;

  return (
    <section className="mt-10">
      <div>
        <h2 className="text-3xl font-bold">{seriesMeta?.name ?? "모아보기"}</h2>

        <div className="flex items-center justify-between">
          <span className="mt-3 text-sm text-foreground/60">
            {seriesMeta?.description ?? "모든 글들을 자유롭게 둘러보세요."}
          </span>
          <SortSelectClient value={result.applied.sort} />
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
