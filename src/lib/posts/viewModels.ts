import type { VelitePost } from "./source";

export interface PostCardModel {
  href: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  category: string;
  date: string;
  title: string;
  excerpt?: string;
}

export function toPostCardModel(post: VelitePost): PostCardModel {
  return {
    href: `/posts/${post.slug}`,
    thumbnailSrc: post.thumbnail ?? "/post-fallback.png",
    thumbnailAlt: post.title,
    category: post.category,
    date: post.date,
    title: post.title,
    excerpt: post.summary,
  };
}