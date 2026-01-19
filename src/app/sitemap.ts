import type { MetadataRoute } from "next";
import { velitePosts } from "@/lib/posts";
import { CATEGORY_CONFIG } from "@/config/categories";

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

  return [...staticPages, ...categories, ...posts];
}
