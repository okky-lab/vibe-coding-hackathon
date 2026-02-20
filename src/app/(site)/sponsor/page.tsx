import Image from "next/image";

const sponsors = [
  {
    name: "eBrain",
    href: "https://ebrain.kr/",
    logo: "/sponsors/ebrain-logo.png",
    logoAlt: "eBrain 로고",
    description: "기술 인재와 기업을 연결하는 Tech Talent Company로, 개발자 커뮤니티와 채용 생태계를 지원합니다.",
    isDarkLogo: false,
  },
  {
    name: "PopupStudio",
    href: "https://popupstudio.ai/",
    logo: "/sponsors/popupstudio-horizontal-white.svg",
    logoAlt: "PopupStudio 로고",
    description: "AI-native 스타트업 스튜디오로, 아이디어를 빠르게 프로덕트로 연결할 수 있는 인프라와 커뮤니티를 제공합니다.",
    isDarkLogo: true,
  },
] as const;

export default function SponsorPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-var(--fd-header-height,0px)-var(--fd-banner-height,0px))] w-full max-w-(--fd-layout-width) flex-1 flex-col border-x px-4 py-14 sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl">Sponsor</h1>
        <p className="mt-3 text-center text-muted-foreground">
          바이브 코딩 해카톤을 함께 만들어가는 파트너사입니다.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {sponsors.map((sponsor) => (
            <article key={sponsor.name} className="rounded-2xl border border-border bg-background p-5">
              <a
                href={sponsor.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${sponsor.name} 홈페이지 (새 탭)`}
                className="group block"
              >
                <div
                  className={
                    sponsor.isDarkLogo
                      ? "flex h-16 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 px-4"
                      : "flex h-16 items-center justify-center rounded-xl border border-border bg-muted/30 px-4"
                  }
                >
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.logoAlt}
                    width={sponsor.isDarkLogo ? 191 : 54}
                    height={sponsor.isDarkLogo ? 27 : 54}
                    className={sponsor.isDarkLogo ? "h-6 w-auto object-contain" : "h-11 w-11 object-contain"}
                  />
                </div>
                <h2 className="mt-4 text-xl font-semibold">{sponsor.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{sponsor.description}</p>
                <span className="mt-4 inline-flex text-sm font-medium text-primary underline-offset-4 transition group-hover:underline">
                  공식 사이트 방문
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
