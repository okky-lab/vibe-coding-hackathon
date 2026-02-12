import type { Metadata } from "next";
import type { TOCItemType } from "fumadocs-core/toc";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import docsMeta from "../../../../contents/docs/meta.json";

import { docsSource } from "@/lib/docs-source";
import { getMDXComponents } from "@/mdx-components";
import { siteConfig } from "@/lib/site-config";

type LoadedDoc = {
  body: React.ComponentType<{ components?: MDXComponents }>;
  toc: TOCItemType[];
};

type DocsPageData = {
  title: string;
  description?: string;
  summary?: string;
  full?: boolean;
  load: () => Promise<LoadedDoc>;
};

const docsOrderMap = new Map(
  (Array.isArray(docsMeta.pages) ? docsMeta.pages : []).map((slug, index) => [slug, index]),
);

function getDocsSlug(url: string) {
  return url.replace(/^\/docs\//, "");
}

export function generateStaticParams() {
  return docsSource.generateParams("slug");
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await props.params;

  if (!slug || slug.length === 0) {
    return {
      title: "문서",
      description: "해카톤 운영 문서 인덱스",
    };
  }

  const page = docsSource.getPage(slug);
  if (!page) {
    return {
      title: "문서",
    };
  }

  const pageData = page.data as DocsPageData;
  const description = pageData.description ?? pageData.summary;

  return {
    title: pageData.title,
    description,
    openGraph: {
      title: pageData.title,
      description,
      type: "article",
      url: `${siteConfig.url}${page.url}`,
    },
  };
}

export default async function DocsCatchAllPage(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await props.params;

  if (!slug || slug.length === 0) {
    const pages = docsSource
      .getPages()
      .sort((a, b) => {
        const aOrder = docsOrderMap.get(getDocsSlug(a.url));
        const bOrder = docsOrderMap.get(getDocsSlug(b.url));
        if (aOrder !== undefined && bOrder !== undefined) return aOrder - bOrder;
        if (aOrder !== undefined) return -1;
        if (bOrder !== undefined) return 1;
        return a.url.localeCompare(b.url, "ko");
      });

    return (
      <main className="[grid-area:main] w-full px-4 pb-20 pt-6 md:px-6 md:pt-8 xl:px-8 xl:pt-14">
        <div className="mx-auto w-full max-w-[900px]">
          <section className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm sm:p-7">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">문서</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
              해카톤 운영에 필요한 규칙, 일정, 참가 가이드를 문서 형태로 제공합니다.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
              {pages.map((page) => {
                const pageData = page.data as DocsPageData;

                return (
                  <Link
                    className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted/50 hover:text-foreground sm:text-sm"
                    href={page.url}
                    key={`chip-${page.url}`}
                  >
                    {pageData.title}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:gap-4">
            {pages.map((page) => {
              const pageData = page.data as DocsPageData;
              const description = pageData.description ?? pageData.summary;

              return (
                <Link
                  className="group rounded-2xl border border-border/80 bg-card/50 p-4 transition hover:border-border hover:bg-card active:scale-[0.995] sm:p-5"
                  href={page.url}
                  key={page.url}
                >
                  <div className="text-base font-semibold text-foreground sm:text-lg">{pageData.title}</div>
                  {description ? (
                    <div className="mt-2 text-sm leading-relaxed text-muted-foreground sm:line-clamp-2">
                      {description}
                    </div>
                  ) : null}
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition group-hover:text-foreground">
                    바로 보기
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </section>
        </div>
      </main>
    );
  }

  const page = docsSource.getPage(slug);
  if (!page) notFound();

  const pageData = page.data as DocsPageData;
  const doc = await pageData.load();
  const Content = doc.body;

  return (
    <DocsPage toc={doc.toc} full={pageData.full}>
      <DocsTitle>{pageData.title}</DocsTitle>
      <DocsDescription>{pageData.description ?? pageData.summary}</DocsDescription>
      <DocsBody>
        <Content components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}
