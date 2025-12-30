import CategoryPage from "@/app/(layout)/(shell)/(category)/[category]/_components/CategoryPage";
import {
  CATEGORY_CONFIG,
  CategoryId,
} from "@/app/(layout)/(shell)/(category)/_constants/category.config";

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

  const categoryId = category as CategoryId;
  const config = CATEGORY_CONFIG[categoryId];

  if (!config) return notFound();

  const sp = await searchParams;

  return <CategoryPage config={config} searchParams={sp} />;
}
