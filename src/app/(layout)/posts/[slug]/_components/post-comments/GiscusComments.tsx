"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef } from "react";

export default function GiscusComments() {
  const ref = useRef<HTMLDivElement | null>(null);
  const loadedRef = useRef(false);
  const { resolvedTheme } = useTheme();

  const themeValue = useMemo(() => {
    if (typeof window === "undefined") return "preferred_color_scheme";

    const isHttp = window.location.protocol === "http:";
    const origin = window.location.origin;
    const path =
      resolvedTheme === "dark" ? "/giscus-dark.css" : "/giscus-light.css";

    if (isHttp) {
      return resolvedTheme === "dark" ? "dark" : "light";
    }

    return `${origin}${path}?v=2`;
  }, [resolvedTheme]);

  useEffect(() => {
    if (!ref.current) return;
    if (!themeValue) return;
    if (loadedRef.current) return;

    loadedRef.current = true;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.setAttribute("data-repo", "swallowedB/b-log");
    script.setAttribute("data-repo-id", "R_kgDOQS4quw");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOQS4qu84Cz4LV");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "0");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-lang", "en");

    script.setAttribute("data-theme", themeValue);

    ref.current.appendChild(script);
  }, [themeValue]);

  useEffect(() => {
    if (!themeValue) return;

    const iframe = document.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame"
    );
    if (!iframe) return;

    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: themeValue } } },
      "https://giscus.app"
    );
  }, [themeValue]);

  return <div ref={ref} className="giscus" />;
}
