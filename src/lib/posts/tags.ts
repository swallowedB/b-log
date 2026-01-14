import { getAllPosts } from "@/lib/posts/queries";

export function getAllTags(includeDrafts = false): string[] {
  const posts = getAllPosts({ includeDrafts });

  const countMap = new Map<string, number>();

  for (const post of posts) {
    if (!post.tags) continue;

    for (const tag of post.tags) {
      countMap.set(tag, (countMap.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(countMap.entries())
    .sort((a, b) => {
      const countDiff = b[1] - a[1];
      if (countDiff !== 0) return countDiff;
      return a[0].localeCompare(b[0], "en");
    })
    .map(([tag]) => tag);
}