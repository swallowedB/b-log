import type { QueryPostsParams } from "./query";
import type { PostSort } from "./utils";

type RawSearchParams = Record<string, string | string[] | undefined>;

function getString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function getNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function getSort(value: string | undefined): PostSort {
  if (value === "popular") return "popular";
  return "latest";
}

export function parsePostSearchParams(
  searchParams: RawSearchParams,
  defaults?: Partial<QueryPostsParams>
): QueryPostsParams {
  const page = getNumber(getString(searchParams.page), defaults?.page ?? 1);
  const perPage = getNumber(
    getString(searchParams.perPage),
    defaults?.perPage ?? 10
  );

  const sortParam = getString(searchParams.sort) ?? defaults?.sort;
  const sort = getSort(sortParam);

  const category = getString(searchParams.category) ?? defaults?.category;
  const series = getString(searchParams.series) ?? defaults?.series;
  const tag = getString(searchParams.tag) ?? defaults?.tag;

  return {
    page,
    perPage,
    sort,
    category,
    series,
    tag,
    visiblePages: defaults?.visiblePages ?? 5,
    includeDrafts: defaults?.includeDrafts ?? false,
  };
}
