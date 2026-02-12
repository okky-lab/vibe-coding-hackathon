import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-(--fd-layout-width) flex-col items-center gap-2 border-x px-4 py-6 text-center text-sm text-muted-foreground sm:px-6">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <p>국내 최대 개발자 커뮤니티 OKKY가 진행하는 바이브 코딩 해커톤 공식 랜딩 페이지입니다.</p>
      </div>
    </footer>
  );
}
