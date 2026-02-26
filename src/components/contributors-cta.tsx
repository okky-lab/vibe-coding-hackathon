import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Ripple } from "./ripple-bg";

const CONTRIBUTORS_URL = "https://github.com/okky-lab/vibe-coding-hackathon/graphs/contributors";
const CONTRIBUTORS_IMAGE_URL = "https://contrib.rocks/image?repo=okky-lab/vibe-coding-hackathon";

export function ContributorsCta() {
  return (
    <section
      className="bg-secondary/75 relative mx-auto flex w-full max-w-6xl flex-col items-center overflow-hidden rounded-3xl border border-border/70 px-6 py-12 text-center md:px-10 md:py-16"
      data-testid="contributors-rocks"
    >
      <div className="pointer-events-none absolute -top-px left-1/2 w-screen -translate-x-1/2 border-t" />
      <Ripple className="opacity-45" mainCircleOpacity={0.2} numCircles={7} />

      <div className="relative z-10 flex w-full flex-col items-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">Community Recognition</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">팀</h2>
        <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-6 md:text-base">
          이 저장소에 기여한 GitHub 사용자 아바타를 한눈에 확인할 수 있습니다.
        </p>

        <Link
          href={CONTRIBUTORS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub contributors"
          className="mt-8 block w-full rounded-xl border border-border/70 bg-background/70 p-3 transition hover:bg-muted/50"
        >
          <Image
            src={CONTRIBUTORS_IMAGE_URL}
            alt="okky-lab/vibe-coding-hackathon contributors"
            width={1200}
            height={180}
            className="h-auto w-full"
            unoptimized
          />
        </Link>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href={CONTRIBUTORS_URL} target="_blank" rel="noopener noreferrer">
              GitHub contributors
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://contrib.rocks" target="_blank" rel="noopener noreferrer">
              Made with contrib.rocks
            </Link>
          </Button>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-px left-1/2 w-screen -translate-x-1/2 border-b" />
    </section>
  );
}
