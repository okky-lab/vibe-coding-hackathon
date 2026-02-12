import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

import { siteConfig } from "@/lib/site-config";

export function baseOptions(): BaseLayoutProps {
  const links: LinkItemType[] = siteConfig.nav.map((item) => ({
    type: "main",
    text: item.label,
    url: item.href,
  }));

  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <Image
            alt="OKKY 로고"
            className="size-6 rounded-sm object-contain"
            height={24}
            priority
            src="https://static.cdn.okky.kr/okky-web/public/okky.png"
            width={24}
          />
        </div>
      ),
    },
    links,
    githubUrl: "https://github.com/okky-lab/vibe-coding-hackathon",
  };
}
