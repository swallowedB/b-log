"use client";

import { useEffect, useRef, useState } from "react";
import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { getOrCreateViewerId } from "@/lib/supabase/viewerId";

type UsePostLikeResult = {
  count: number;
  liked: boolean;
  loading: boolean;
  toggleLike: () => Promise<void>;
};

function isDuplicateKeyError(error: PostgrestError | null): boolean {
  return !!error && error.code === "23505";
}

export function usePostLike(postId: string): UsePostLikeResult {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const viewerIdRef = useRef<string | null>(null);

  useEffect(() => {
    viewerIdRef.current = getOrCreateViewerId();
  }, []);

  useEffect(() => {
    if (!postId) return;

    const fetchLikeState = async () => {
      const viewerId = viewerIdRef.current ?? getOrCreateViewerId();
      if (!viewerId) {
        setLoading(false);
        return;
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
        setLoading(false);
        return;
      }

      const rows = data ?? [];

      setCount(total ?? rows.length);
      setLiked(rows.some((row) => row.viewer_id === viewerId));
      setLoading(false);
    };

    void fetchLikeState();
  }, [postId]);

  const refreshCount = async () => {
    const { count: total, error } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);

    if (error) {
      console.error("좋아요 카운트 재조회 실패:", error);
      return;
    }

    if (typeof total === "number") {
      setCount(total);
    }
  };

  const toggleLike = async () => {
    const viewerId = viewerIdRef.current ?? getOrCreateViewerId();
    if (!viewerId) return;

    if (liked) {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("viewer_id", viewerId);

      if (error) {
        console.error("좋아요 취소 실패:", error);
        return;
      }

      setLiked(false);
      setCount((prev) => Math.max(0, prev - 1));
      return;
    }

    const { error } = await supabase.from("post_likes").insert({
      post_id: postId,
      viewer_id: viewerId,
    });

    if (error) {
      if (isDuplicateKeyError(error)) {
        setLiked(true);
        await refreshCount();
      } else {
        console.error("좋아요 추가 실패:", error);
      }
      return;
    }

    setLiked(true);
    setCount((prev) => prev + 1);
  };

  return {
    count,
    liked,
    loading,
    toggleLike,
  };
}