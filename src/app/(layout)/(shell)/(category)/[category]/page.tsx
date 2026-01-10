import CategoryPage from "@/app/(layout)/(shell)/(category)/[category]/_components/CategoryPage";
import { CATEGORY_CONFIG, CategorySlug } from "@/config/categories";

import { SearchParams } from "@/types/route.types";
import { notFound } from "next/navigation";

export default async function CategoryRoutePage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { category } = await params;

  const slug = category as CategorySlug;
  const config = CATEGORY_CONFIG[slug];

  if (!config) return notFound();

  const sp = await searchParams;

  return <CategoryPage config={config} searchParams={sp} />;
}
