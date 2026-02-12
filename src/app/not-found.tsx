import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium text-teal-600">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-muted-foreground">
        요청하신 주소가 없거나 이동되었습니다. 문서 인덱스에서 원하는 페이지를 다시 선택해 주세요.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          href="/"
        >
          홈으로 이동
        </Link>
        <Link
          className="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-muted"
          href="/docs"
        >
          문서 보기
        </Link>
      </div>
    </div>
  );
}
