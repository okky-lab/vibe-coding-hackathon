import { DocsLayout } from "fumadocs-ui/layouts/docs";
import Image from "next/image";

import { docsSource } from "@/lib/docs-source";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout
      tree={docsSource.getPageTree()}
      sidebar={{
        enabled: true,
        defaultOpenLevel: 2,
        collapsible: true,
      }}
      nav={{
        enabled: false,
        title: (
          <span className="inline-flex items-center" aria-label="홈으로 이동">
            <Image
              src="/okky-logo.png"
              alt="OKKY 로고"
              width={28}
              height={28}
              className="rounded-sm object-contain"
              priority
            />
          </span>
        ),
      }}
      containerProps={{ className: "docs-no-hover bg-background [--fd-header-height:0px]" }}
    >
      {children}
    </DocsLayout>
  );
}
