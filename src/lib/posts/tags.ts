import { getAllPosts } from "@/lib/posts/queries";

export function getAllTags(includeDrafts = false): string[] {
  const posts = getAllPosts({ includeDrafts });

  const tagSet = new Set<string>();

  for (const post of posts) {
    if (!post.tags) continue;

    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort((a, b) => a.localeCompare(b, "en"));
}