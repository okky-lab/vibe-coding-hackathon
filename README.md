# Vibe Coding Hackathon Site (Fumadocs)

`landing + docs` 중심의 해카톤 운영 사이트입니다.

## Tech Stack

- Next.js 16 / React 19 / TypeScript
- Fumadocs (`fumadocs-core`, `fumadocs-mdx`, `fumadocs-ui`)
- Tailwind CSS v4
- Playwright E2E

## Local Development

```bash
pnpm install
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열어 확인합니다.

## Docs Content

문서는 `contents/docs` 의 MDX 파일로 관리합니다.

- 인덱스/정렬: `contents/docs/meta.json`
- 문서 라우트: `/docs` 및 `/docs/[slug]`

## Quality Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test:e2e
```

## Deployment (Vercel)

- 필수 환경변수: `NEXT_PUBLIC_APP_URL`
- Preview/Production 환경을 분리해 배포합니다.
