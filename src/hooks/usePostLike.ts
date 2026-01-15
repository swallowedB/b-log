"use client";

import { useEffect, useRef, useState } from "react";
import { getOrCreateViewerId } from "@/lib/supabase/viewerId";
import {
  addPostLike,
  fetchPostLikeCount,
  fetchPostLikeState,
  isDuplicateKeyError,
  removePostLike,
} from "@/lib/supabase/postLikes";

type UsePostLikeResult = {
  count: number;
  liked: boolean;
  loading: boolean;
  toggleLike: () => Promise<void>;
};

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

    const run = async () => {
      const viewerId = viewerIdRef.current ?? getOrCreateViewerId();
      const { count, liked } = await fetchPostLikeState(postId, viewerId);

      setCount(count);
      setLiked(liked);
      setLoading(false);
    };

    void run();
  }, [postId]);

  const toggleLike = async () => {
    const viewerId = viewerIdRef.current ?? getOrCreateViewerId();
    if (!viewerId || !postId) return;

    if (liked) {
      const { error } = await removePostLike(postId, viewerId);
      if (error) {
        console.error("좋아요 취소 실패:", error);
        return;
      }

      setLiked(false);
      setCount((prev) => Math.max(0, prev - 1));
      return;
    }

    const { error } = await addPostLike(postId, viewerId);

    if (error) {
      if (isDuplicateKeyError(error)) {
        setLiked(true);
        const refreshed = await fetchPostLikeCount(postId);
        setCount(refreshed);
      } else {
        console.error("좋아요 추가 실패:", error);
      }
      return;
    }

    setLiked(true);
    setCount((prev) => prev + 1);
  };

  return { count, liked, loading, toggleLike };
}
