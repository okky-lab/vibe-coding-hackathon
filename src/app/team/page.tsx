import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { submittedTeams } from "@/lib/content";

export const metadata: Metadata = {
  title: "팀 프로젝트",
  description: "해커톤 참가팀과 제출 프로젝트 정보를 확인할 수 있습니다.",
};

function getPrimaryLink(team: (typeof submittedTeams)[number]) {
  if (team.projectUrl) return { href: team.projectUrl, label: "프로젝트 보기" };
  if (team.demoUrl) return { href: team.demoUrl, label: "데모 보기" };
  if (team.repositoryUrl) return { href: team.repositoryUrl, label: "저장소 보기" };
  return null;
}

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
          {submittedTeams.map((team) => {
            const primaryLink = getPrimaryLink(team);

            return (
              <Card key={team.info.path} className="relative mx-auto w-full max-w-sm overflow-hidden pt-0">
                <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                <div className="relative z-20 aspect-video w-full overflow-hidden">
                  {team.imageUrl ? (
                    <Image
                      src={team.imageUrl}
                      alt={`${team.name} 대표 이미지`}
                      width={1280}
                      height={720}
                      className="aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 384px"
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-zinc-700 via-zinc-600 to-zinc-500 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700" />
                  )}
                </div>
                <CardHeader className="relative z-40">
                  <CardAction className="flex items-center gap-2">
                    <Badge variant={team.order === 1 ? "default" : "secondary"}>
                      {team.order === 1 ? "Featured" : "Team"}
                    </Badge>
                    <Badge variant="outline" className="bg-background/80">
                      {team.role}
                    </Badge>
                  </CardAction>
                  <CardTitle className="text-balance text-lg sm:text-xl">{team.projectName ?? "프로젝트 미기재"}</CardTitle>
                  <CardDescription className="space-y-1">
                    <p className="font-medium text-foreground">{team.name}</p>
                    <p className="line-clamp-2">{team.projectSummary ?? team.bio}</p>
                    <p className="text-xs">제출 시각: {formatSubmittedAt(team.submittedAt)}</p>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="relative z-40">
                  {primaryLink ? (
                    <Button className="w-full" asChild>
                      <Link href={primaryLink.href} target="_blank" rel="noopener noreferrer">
                        {primaryLink.label}
                      </Link>
                    </Button>
                  ) : (
                    <Button className="w-full" disabled>
                      링크 준비중
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
