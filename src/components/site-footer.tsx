import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-(--fd-layout-width) flex-col items-center gap-2 border-x px-4 py-6 text-center text-sm text-muted-foreground sm:px-6">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <p>AI 시대를 위해 먼저 나아가는 국내 최대 개발자 커뮤니티 OKKY가 진행하는 바이브 코딩 해커톤 공식 페이지입니다.</p>
        <nav className="mt-1 flex items-center gap-4">
          <a
            href="https://okky.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            OKKY
          </a>
          <Link href="/docs/overview" className="transition-colors hover:text-foreground">
            개요
          </Link>
          <Link href="/docs/code-of-conduct" className="transition-colors hover:text-foreground">
            행동강령
          </Link>
        </nav>
      </div>
    </footer>
  );
}
