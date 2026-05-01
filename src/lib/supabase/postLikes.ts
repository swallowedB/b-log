import { supabase } from "@/lib/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

export type PopularRow = { post_id: string; like_count: number };

export type LikeCountMap = Record<string, number>;

export type LikeState = {
  count: number;
  liked: boolean;
};

export function isDuplicateKeyError(error: PostgrestError | null): boolean {
  return !!error && error.code === "23505";
}

/* 단일 포스트 좋아요 상태 + 카운트 조회 */
export async function fetchPostLikeState(
  postId: string,
  viewerId: string | null,
): Promise<LikeState> {
  if (!postId || !viewerId) {
    return { count: 0, liked: false };
  }

  const {
    data,
    count: total,
    error,
  } = await supabase
    .from("post_likes")
    .select("viewer_id", { count: "exact" })
    .eq("post_id", postId);

  if (error) {
    console.error("좋아요 조회 실패:", error);
    return { count: 0, liked: false };
  }

  const rows = data ?? [];
  const count = total ?? rows.length;
  const liked = rows.some((row) => row.viewer_id === viewerId);

  return { count, liked };
}

/* 카운트만 새로 조회 */
export async function fetchPostLikeCount(postId: string): Promise<number> {
  if (!postId) return 0;

  const { count: total, error } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (error) {
    console.error("좋아요 카운트 재조회 실패:", error);
    return 0;
  }

  return typeof total === "number" ? total : 0;
}

/* 좋아요 추가 */
export async function addPostLike(postId: string, viewerId: string) {
  const { error } = await supabase.from("post_likes").insert({
    post_id: postId,
    viewer_id: viewerId,
  });

  return { error };
}

/* 좋아요 취소 */
export async function removePostLike(postId: string, viewerId: string) {
  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("viewer_id", viewerId);

  return { error };
}

/* 인기 정렬용 */
export async function getLikeCountsForPosts(
  postIds: string[],
): Promise<LikeCountMap> {
  if (!postIds.length) return {};

  const { data, error } = await supabase
    .from("post_like_counts")
    .select("post_id, like_count")
    .in("post_id", postIds);

  if (error) {
    console.error("🚨 post_like_counts 조회 실패:", error);
    return {};
  }

  const map: LikeCountMap = {};

  for (const row of data ?? []) {
    map[row.post_id] = row.like_count ?? 0;
  }

  return map;
}

export async function fetchPopularRankPage(
  limit: number,
  offset: number,
): Promise<PopularRow[]> {
  const { data, error } = await supabase
    .from("post_like_counts")
    .select("post_id, like_count")
    .gt("like_count", 0) 
    .order("like_count", { ascending: false })
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("🚨 인기순 페이지 패치 실패:", error);
    return [];
  }

  return (data ?? []) as PopularRow[];
}