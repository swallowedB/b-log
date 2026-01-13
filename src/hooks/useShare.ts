"use client";

import { useCallback, useRef } from "react";

type ShareOptions = {
  title: string;
  url?: string;
  imageUrl?: string;
};

type ShareResult =
  | { ok: true; method: "native" | "clipboard" }
  | { ok: false; error: Error; aborted?: boolean };

type NavigatorWithShare = Navigator & {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data?: ShareData) => boolean;
};

export function useShare(defaultOptions?: Partial<ShareOptions>) {
  const isSharingRef = useRef(false);

  const share = useCallback(
    async (options?: ShareOptions): Promise<ShareResult> => {
      if (typeof window === "undefined") {
        return {
          ok: false,
          error: new Error("클라이언트 환경에서만 공유 기능을 사용할 수 있습니다.")
        };
      }

      if (isSharingRef.current) {
        return {
          ok: false,
          aborted: true,
          error: new Error("이미 공유가 진행 중입니다.")
        };
      }

      const merged: ShareOptions = {
        title: options?.title ?? defaultOptions?.title ?? document.title,
        url: options?.url ?? defaultOptions?.url ?? window.location.href,
        imageUrl: options?.imageUrl ?? defaultOptions?.imageUrl
      };

      if (!merged.url) {
        return {
          ok: false,
          error: new Error("공유할 URL이 없습니다.")
        };
      }

      const nav = navigator as NavigatorWithShare;
      const shareData: ShareData & { files?: File[] } = {
        title: merged.title,
        url: merged.url
      };

      isSharingRef.current = true;
      try {
        if (merged.imageUrl && typeof nav.canShare === "function") {
          try {
            const response = await fetch(merged.imageUrl);
            const blob = await response.blob();
            const file = new File([blob], "post-thumbnail.png", {
              type: blob.type || "image/png"
            });

            if (nav.canShare({ files: [file] })) {
              shareData.files = [file];
            }
          } catch {}
        }

        if (typeof nav.share === "function") {
          try {
            await nav.share(shareData);
            return { ok: true, method: "native" };
          } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            if (err.name === "AbortError") {
              return { ok: false, aborted: true, error: err };
            }
            if (err.name === "InvalidStateError") {
              return { ok: false, aborted: true, error: err };
            }
          }
        }

        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
          try {
            await navigator.clipboard.writeText(merged.url);
            return { ok: true, method: "clipboard" };
          } catch (error) {
            return {
              ok: false,
              error: error instanceof Error ? error : new Error("클립보드 복사에 실패했습니다.")
            };
          }
        }

        return {
          ok: false,
          error: new Error("이 브라우저에서는 공유 기능을 사용할 수 없습니다.")
        };
      } finally {
        isSharingRef.current = false;
      }
    },
    [defaultOptions]
  );

  return { share };
}
