import CategoryPage from "@/app/(layout)/(shell)/(category)/[category]/_components/CategoryPage";
import {
  CATEGORY_CONFIG,
  CategoryId,
} from "@/app/(layout)/(shell)/(category)/_constants/category.Config";
import { notFound } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

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

  return <CategoryPage category={categoryId} config={config} searchParams={sp} />;
}
