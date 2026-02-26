"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

type GiscusCommentsProps = {
  className?: string;
};

const GISCUS_ORIGIN = "https://giscus.app";
const GISCUS_SCRIPT_SRC = `${GISCUS_ORIGIN}/client.js`;
const GISCUS_THEME_DARK = "dark_dimmed";
const GISCUS_THEME_LIGHT = "light";

const GISCUS_ATTRIBUTES: Readonly<Record<string, string>> = {
  "data-repo": "okky-lab/vibe-coding-hackathon",
  "data-repo-id": "R_kgDORNqBFQ",
  "data-category": "General",
  "data-category-id": "DIC_kwDORNqBFc4C3N8h",
  "data-mapping": "pathname",
  "data-strict": "0",
  "data-reactions-enabled": "1",
  "data-emit-metadata": "1",
  "data-input-position": "top",
  "data-lang": "ko",
  "data-loading": "lazy",
};

function resolveGiscusTheme() {
  if (typeof document === "undefined") return GISCUS_THEME_DARK;
  return document.documentElement.classList.contains("dark") ? GISCUS_THEME_DARK : GISCUS_THEME_LIGHT;
}

export function GiscusComments({ className }: GiscusCommentsProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState(() => resolveGiscusTheme());
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setTheme(resolveGiscusTheme());

    syncTheme();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          syncTheme();
          break;
        }
      }
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = GISCUS_SCRIPT_SRC;
    script.async = true;
    script.crossOrigin = "anonymous";

    for (const [name, value] of Object.entries(GISCUS_ATTRIBUTES)) {
      script.setAttribute(name, value);
    }
    script.setAttribute("data-theme", themeRef.current);

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [pathname]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = container.querySelector<HTMLScriptElement>(`script[src="${GISCUS_SCRIPT_SRC}"]`);
    script?.setAttribute("data-theme", theme);

    const iframe = container.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    iframe?.contentWindow?.postMessage({ giscus: { setConfig: { theme } } }, GISCUS_ORIGIN);
  }, [theme]);

  return (
    <section className={cn("giscus-thread", className)} aria-label="댓글">
      <div ref={containerRef} className="giscus" />
    </section>
  );
}
