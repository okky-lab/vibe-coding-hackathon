import { ExternalLink, FileText, ShieldCheck, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

const footerLinks = [
  { label: "OKKY", href: "https://okky.kr", external: true },
  { label: "개요", href: "/docs/overview", external: false },
  { label: "행동강령", href: "/docs/code-of-conduct", external: false },
] as const;

const footerQuickActions: Array<{
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
}> = [
  { label: "OKKY", href: "https://okky.kr", icon: ExternalLink, external: true },
  { label: "개요", href: "/docs/overview", icon: FileText },
  { label: "행동강령", href: "/docs/code-of-conduct", icon: ShieldCheck },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-(--fd-layout-width) border-x px-4 py-12 sm:px-6 md:py-16">
        <div className="flex flex-col items-center space-y-8 text-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
              O
            </div>
            <span className="text-lg font-bold tracking-tight">{siteConfig.name}</span>
          </Link>

          <p className="max-w-2xl text-sm text-muted-foreground">
            AI 시대를 위해 먼저 나아가는 국내 최대 개발자 커뮤니티 OKKY가 진행하는 바이브 코딩 해커톤 공식 페이지입니다.
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {footerLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-4">
            {footerQuickActions.map((action) =>
              action.external ? (
                <a
                  key={action.label}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <action.icon className="h-5 w-5" />
                  <span className="sr-only">{action.label}</span>
                </a>
              ) : (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <action.icon className="h-5 w-5" />
                  <span className="sr-only">{action.label}</span>
                </Link>
              ),
            )}
          </div>

          <div className="h-px w-full max-w-xs bg-border" />

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
