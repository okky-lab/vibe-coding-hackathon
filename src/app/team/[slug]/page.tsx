import type { Metadata } from "next";
import type { TOCItemType } from "fumadocs-core/toc";
import { team as teamCollection } from "fumadocs-mdx:collections/server";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GiscusComments } from "@/components/giscus-comments.client";
import { getMDXComponents } from "@/mdx-components";
import { siteConfig } from "@/lib/site-config";

type TeamDoc = (typeof teamCollection)[number];
type TeamDocBody = React.ComponentType<{ components?: MDXComponents }>;

function normalizeTeamSlug(path: string) {
  return path.replace(/\.mdx?$/i, "");
}

function findTeamDocBySlug(slug: string): TeamDoc | null {
  return teamCollection.find((entry) => normalizeTeamSlug(entry.info.path) === slug) ?? null;
}

function getProjectTitle(entry: TeamDoc) {
  const projectName = entry.projectName?.trim();
  if (projectName) return projectName;
  return entry.name;
}

function getProjectDescription(entry: TeamDoc) {
  const summary = entry.projectSummary?.trim();
  if (summary) return summary;
  return entry.bio;
}

export function generateStaticParams() {
  return teamCollection.map((entry) => ({ slug: normalizeTeamSlug(entry.info.path) }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const teamDoc = findTeamDocBySlug(slug);

  if (!teamDoc) {
    return { title: "프로젝트" };
  }

  const title = getProjectTitle(teamDoc);
  const description = getProjectDescription(teamDoc);
  const url = `${siteConfig.url}/team/${encodeURIComponent(normalizeTeamSlug(teamDoc.info.path))}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url,
    },
  };
}

export default async function TeamSubmissionPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const teamDoc = findTeamDocBySlug(slug);
  if (!teamDoc) notFound();

  const title = getProjectTitle(teamDoc);
  const description = getProjectDescription(teamDoc);
  const Content = teamDoc.body as TeamDocBody;
  const toc = (teamDoc.toc ?? []).filter((item): item is TOCItemType => Boolean(item?.url));

  return (
    <main className="[grid-area:main] w-full px-4 pb-20 pt-6 md:px-6 md:pt-8 xl:px-8 xl:pt-14">
      <div className="mx-auto grid w-full max-w-[1100px] gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
        <article className="min-w-0 rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm sm:p-7">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">{description}</p>
          </header>
          <div className="mt-6">
            <Content components={getMDXComponents()} />
          </div>
          <GiscusComments />
        </article>
        {toc.length > 0 ? (
          <aside className="hidden xl:block">
            <div className="sticky top-6 rounded-2xl border border-border/70 bg-card/60 p-4 backdrop-blur-sm">
              <p className="text-sm font-semibold">목차</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {toc.map((item) => (
                  <li key={item.url} className={item.depth > 2 ? "pl-3" : ""}>
                    <Link href={item.url} className="transition-colors hover:text-foreground">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
