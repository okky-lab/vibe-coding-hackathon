import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link className="flex items-center gap-2" href="/">
          <Image
            alt="OKKY 로고"
            className="size-7 rounded-sm object-contain"
            height={28}
            priority
            src="https://static.cdn.okky.kr/okky-web/public/okky.png"
            width={28}
          />
          <span className="text-sm font-semibold tracking-tight sm:text-base">{siteConfig.name}</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted-foreground">
          {siteConfig.nav.map((item) => (
            <Link className="transition-colors hover:text-foreground" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
