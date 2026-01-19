import CategoryPage from "@/app/(layout)/(shell)/(category)/[category]/_components/CategoryPage";
import { CATEGORY_CONFIG, CategorySlug } from "@/config/categories";
import { SearchParams } from "@/types/route.types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata(
  { params }: Pick<CategoryPageProps, "params">
): Promise<Metadata> {
  const { category } = await params;
  if (!(category in CATEGORY_CONFIG)) {
    return {};
  }

  const slug = category as CategorySlug;
  const config = CATEGORY_CONFIG[slug];

  const baseUrl = "https://b0o0a.com";
  const url = `${baseUrl}/category/${slug}`;

  const title = config.title;
  const description =
    config.description ?? "";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function CategoryRoutePage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;

  const slug = category as CategorySlug;
  const config = CATEGORY_CONFIG[slug];

  if (!config) return notFound();

  const sp = await searchParams;

  return <CategoryPage config={config} searchParams={sp} />;
}
