import Image from "next/image";
import Link from "next/link";

import { Ripple } from "./ripple-bg";

export function CallToAction() {
  return (
    <section
      className="bg-secondary/75 relative mx-auto flex w-full max-w-6xl flex-col items-center overflow-hidden rounded-3xl border border-border/70 px-6 py-12 text-center md:px-10 md:py-16"
      data-testid="okky-community-cta"
    >
      <div className="pointer-events-none absolute -top-px left-1/2 w-screen -translate-x-1/2 border-t" />
      <Ripple className="opacity-45" mainCircleOpacity={0.2} numCircles={7} />

      <div className="relative z-10 flex flex-col items-center">
        <Image
          alt="OKKY 로고"
          className="mb-4 size-11 rounded-full border border-border/70 bg-background/80 p-2"
          height={44}
          src="https://static.cdn.okky.kr/okky-web/public/okky.png"
          width={44}
        />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">OKKY Community</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">
          OKKY 개발자 커뮤니티에 합류하세요
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6 md:text-base">
          국내 최대 개발자 커뮤니티에서 바이브 코딩 해카톤 소식과 실전 인사이트를 확인하고
          동료 개발자들과 연결해 보세요.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            href="https://okky.kr"
            rel="noopener noreferrer"
            target="_blank"
          >
            OKKY 바로가기
          </Link>
          <Link
            className="inline-flex h-10 items-center rounded-md border border-border bg-background/70 px-4 text-sm font-semibold hover:bg-muted"
            href="mailto:event@okky.kr"
          >
            event@okky.kr 문의
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-px left-1/2 w-screen -translate-x-1/2 border-b" />
    </section>
  );
}
