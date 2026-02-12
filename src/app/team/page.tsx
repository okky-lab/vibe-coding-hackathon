import type { Metadata } from "next";
import { ExternalLinkIcon, GithubIcon, PlayCircleIcon } from "lucide-react";
import Image from "next/image";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { submittedTeams } from "@/lib/content";

export const metadata: Metadata = {
  title: "팀 프로젝트",
  description: "해커톤 참가팀과 제출 프로젝트 정보를 확인할 수 있습니다.",
};

function formatSubmittedAt(value?: string) {
  if (!value) return "제출 시간 미기록";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "제출 시간 미기록";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export default function TeamsPage() {
  return (
    <main className="[grid-area:main] w-full px-4 pb-20 pt-6 md:px-6 md:pt-8 xl:px-8 xl:pt-14">
      <div className="mx-auto w-full max-w-[1100px]">
        <section className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm sm:p-7">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">팀 프로젝트</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
            참가팀이 제출한 프로젝트를 이미지 카드로 확인할 수 있습니다.
          </p>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {submittedTeams.map((team) => (
            <Card
              key={team.info.path}
              className="group overflow-hidden border-border/70 bg-card/70 transition hover:border-border hover:bg-card"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border/70 bg-muted/30">
                {team.imageUrl ? (
                  <Image
                    src={team.imageUrl}
                    alt={`${team.name} 대표 이미지`}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 520px"
                  />
                ) : (
                  <div className="h-full w-full bg-linear-to-br from-zinc-200 via-zinc-100 to-zinc-50 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-950" />
                )}
                <span className="absolute left-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-xs font-medium text-white">
                  {team.role}
                </span>
              </div>

              <CardHeader>
                <CardTitle className="text-xl tracking-tight">{team.name}</CardTitle>
                <CardDescription>{team.projectName ?? "프로젝트 미기재"}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{team.bio}</p>
                <p>{team.projectSummary ?? "프로젝트 요약이 아직 등록되지 않았습니다."}</p>
                <p>제출 시각: {formatSubmittedAt(team.submittedAt)}</p>
              </CardContent>

              <CardFooter className="flex flex-wrap items-center gap-2">
                {team.projectUrl ? (
                  <a
                    href={team.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <ExternalLinkIcon className="size-3.5" />
                    서비스
                  </a>
                ) : null}
                {team.demoUrl ? (
                  <a
                    href={team.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <PlayCircleIcon className="size-3.5" />
                    데모
                  </a>
                ) : null}
                {team.repositoryUrl ? (
                  <a
                    href={team.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <GithubIcon className="size-3.5" />
                    저장소
                  </a>
                ) : null}
              </CardFooter>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
