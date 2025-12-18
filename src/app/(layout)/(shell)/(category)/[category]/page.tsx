import CategoryPage from "@/app/(layout)/(shell)/(category)/[category]/_components/CategoryPage";
import { CATEGORY_CONFIG, CategoryId } from "@/app/(layout)/(shell)/(category)/_constants/category.Config";
import { notFound } from "next/navigation";

export default async function CategoryRoutePage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category as CategoryId;
  const config = CATEGORY_CONFIG[category];

  if (!config) {
    return notFound();
  }

  return (
    <CategoryPage
      category={category}
      config={config}
    />
  );
}
