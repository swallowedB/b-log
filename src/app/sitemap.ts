import type { MetadataRoute } from "next";
import { velitePosts } from "@/lib/posts";
import { CATEGORY_CONFIG } from "@/config/categories";
import { getPublicCases } from "@/lib/resume/content.server";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://b0o0a.com";

  const posts = velitePosts
    .filter((post) => !post.draft) 
    .map((post) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: new Date(post.date),
    }));

  const categories = Object.values(CATEGORY_CONFIG).map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
  ];

  const cases = getPublicCases().map((entry) => ({ url: `${baseUrl}/resume/cases/${entry.slug}`, lastModified: new Date(entry.publishedAt) }));
  return [...staticPages, ...categories, ...posts, ...cases];
}
