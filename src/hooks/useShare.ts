"use client";

import { useCallback, useRef } from "react";

type ShareOptions = {
  title: string;
  url?: string;
  imageUrl?: string;
  includeImageFile?: boolean;
};

type ShareResult =
  | { ok: true; method: "native" | "clipboard" }
  | { ok: false; error: Error; aborted?: boolean };

type NavigatorWithShare = Navigator & {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data?: ShareData) => boolean;
};

type ShareDataWithFiles = ShareData & {
  files?: File[];
};

function normalizeUrl(url: string) {
  return new URL(url, window.location.href).toString();
}

async function buildShareFile(imageUrl: string): Promise<File> {
  const normalized = normalizeUrl(imageUrl);
  const response = await fetch(normalized, { cache: "force-cache" });
  const blob = await response.blob();

  return new File([blob], "post-thumbnail.png", {
    type: blob.type || "image/png",
  });
}

function isUserAbort(error: Error) {
  return error.name === "AbortError" || error.name === "InvalidStateError";
}

export function useShare(defaultOptions?: Partial<ShareOptions>) {
  const isSharingRef = useRef(false);

  const share = useCallback(
    async (options?: ShareOptions): Promise<ShareResult> => {
      if (typeof window === "undefined") {
        return {
          ok: false,
          error: new Error("클라이언트 환경에서만 공유 기능을 사용할 수 있습니다."),
        };
      }

      if (isSharingRef.current) {
        return {
          ok: false,
          aborted: true,
          error: new Error("이미 공유가 진행 중입니다."),
        };
      }

      const merged: ShareOptions = {
        title: options?.title ?? defaultOptions?.title ?? document.title,
        url: options?.url ?? defaultOptions?.url ?? window.location.href,
        imageUrl: options?.imageUrl ?? defaultOptions?.imageUrl,
        includeImageFile:
          options?.includeImageFile ??
          defaultOptions?.includeImageFile ??
          false,
      };

      if (!merged.url) {
        return { ok: false, error: new Error("공유할 URL이 없습니다.") };
      }

      const nav = navigator as NavigatorWithShare;
      const url = normalizeUrl(merged.url);

      isSharingRef.current = true;
      try {
        const canNativeShare = typeof nav.share === "function";

        if (
          merged.includeImageFile &&
          merged.imageUrl &&
          canNativeShare &&
          typeof nav.canShare === "function"
        ) {
          try {
            const file = await buildShareFile(merged.imageUrl);
            const data: ShareDataWithFiles = {
              title: merged.title,
              url,
              files: [file],
            };

            if (nav.canShare(data)) {
              await nav.share(data);
              return { ok: true, method: "native" };
            }
          } catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            if (isUserAbort(err)) {
              return { ok: false, aborted: true, error: err };
            }
          }
        }

        if (canNativeShare) {
          try {
            await nav.share({ title: merged.title, url });
            return { ok: true, method: "native" };
          } catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            if (isUserAbort(err)) {
              return { ok: false, aborted: true, error: err };
            }
          }
        }

        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          return { ok: true, method: "clipboard" };
        }

        return {
          ok: false,
          error: new Error("이 브라우저에서는 공유 기능을 사용할 수 없습니다."),
        };
      } finally {
        isSharingRef.current = false;
      }
    },
    [defaultOptions]
  );

  return { share };
}
