"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

type GiscusCommentsProps = {
  className?: string;
};

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
  "data-theme": "preferred_color_scheme",
  "data-lang": "ko",
  "data-loading": "lazy",
};

export function GiscusComments({ className }: GiscusCommentsProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    for (const [name, value] of Object.entries(GISCUS_ATTRIBUTES)) {
      script.setAttribute(name, value);
    }

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [pathname]);

  return (
    <section className={cn("giscus-thread", className)} aria-label="댓글">
      <div ref={containerRef} className="giscus" />
    </section>
  );
}
