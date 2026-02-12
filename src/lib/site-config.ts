export type NavigationItem = {
  label: string;
  href: string;
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  nav: NavigationItem[];
  eventDateKst: string;
  eventTimeLabel: string;
  eventTitle: string;
  eventDescription: string;
};

export const siteConfig: SiteConfig = {
  name: "OKKY 바이브 코딩 해카톤",
  description: "국내 최대 개발자 커뮤니티 OKKY가 진행하는 AI 바이브 코딩 해커톤",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  eventDateKst: "2026-02-21",
  eventTimeLabel: "2026.02.21(토) 13:00 ~ 18:30",
  eventTitle: "‘코드 짜면 안되는’ 바이브코딩 해커톤",
  eventDescription: "AI로 기획·구현·배포까지 완주하는 해커톤",
  nav: [
    { label: "홈", href: "/" },
    { label: "행사개요", href: "/docs/overview" },
    { label: "일정", href: "/docs/schedule" },
    { label: "FAQ", href: "/faq" },
  ],
};
