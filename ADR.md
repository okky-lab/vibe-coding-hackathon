# 아키텍처 의사결정 기록 (ADR)

## ADR-001 팀 제출 정보를 MDX 컬렉션 + App Router 카드 목록으로 노출

- 상태: 승인
- 날짜: 2026-02-12

### 배경
- 해커톤 참가팀 정보와 제출 프로젝트를 문서 형태로 관리하고, 사이트에서 시각적으로 확인할 수 있는 목록 화면이 필요했습니다.
- 기존 코드베이스는 Fumadocs MDX 컬렉션(`source.config.ts`)을 사용하고 있어 동일한 방식으로 확장하는 것이 자연스럽습니다.

### 결정
- 팀 데이터 저장소를 `contents/team` 디렉토리의 개별 MDX 문서로 정의합니다.
- `team` 컬렉션 스키마에 프로젝트 제출 정보(`projectName`, `projectSummary`, `projectUrl`, `repositoryUrl`, `demoUrl`, `submittedAt`, `order`)를 포함합니다.
- App Router 경로 `/teams`를 추가하고, `@shadcn/card` 컴포넌트 기반의 이미지 카드 목록 UI로 렌더링합니다.
- 목록 정렬은 `order` 오름차순을 우선 적용하고, 동순위는 팀명 기준으로 정렬합니다.
- 카드 UI는 `CardAction + Badge + Button` 패턴으로 통일해 프로젝트/팀 소개와 외부 이동 동선을 단일 액션으로 단순화합니다.
- 저장소 링크는 메인 버튼 우측의 GitHub 아이콘 버튼으로 분리해, 프로젝트 보기와 저장소 보기를 동시에 빠르게 접근할 수 있게 구성합니다.
- 목록 레이아웃은 `md` 이상 구간에서 3열 그리드를 사용해 팀 카드 밀도를 높입니다.

### 근거
- MDX 파일 기반 운영은 비개발자/운영자의 수정 접근성이 높습니다.
- 카드 UI는 팀별 프로젝트를 빠르게 스캔하기에 적합하고, 이미지 없는 경우에도 대체 배경으로 시각적 일관성을 유지할 수 있습니다.
- 기존 Fumadocs 컬렉션 파이프라인을 재사용하여 구현 복잡도를 낮출 수 있습니다.

### 결과
- `/team`에서 팀/프로젝트를 카드 형태로 확인할 수 있게 되었습니다.
- 기존 `/teams` 경로는 `/team`으로 리다이렉트되어 호환성을 유지합니다.
- 팀 데이터는 `contents/team/*.mdx`에서 독립 문서 단위로 관리됩니다.

### 추후 고려사항
- 팀 상세 페이지(`/teams/[slug]`)를 추가해 MDX 본문을 직접 렌더링할 수 있습니다.
- 운영 편의를 위해 제출 링크 유효성 검증(빌드 시 체크)을 추가할 수 있습니다.

## ADR-002 오픈라우터 설정 문서의 Codex 연결 방식 명시

- 상태: 승인
- 날짜: 2026-02-19

### 배경
- 참가자들이 Codex에서 OpenRouter를 연결하는 방식(전용 provider 설정 vs OpenAI provider 호환 설정)을 혼동할 수 있습니다.
- 설정 경로와 환경변수 조합이 문서에 명확히 고정되어야 제출물 검증 시 재현성이 높아집니다.

### 결정
- `contents/docs/openrouter-setup.mdx` 문서의 Codex 섹션을 `codex-cli (@openai/codex)` 기준 안내로 교체합니다.
- Codex 연결 절차는 아래 두 가지를 모두 지원하도록 문서화합니다.
  - 방법 A: `OPENROUTER_API_KEY` 환경변수와 `~/.codex/config.toml`의 `openrouter` provider 설정
  - 방법 B: `OPENAI_BASE_URL`을 `https://openrouter.ai/api/v1`로 지정하는 OpenAI provider 호환 설정
- Codex 섹션에는 지원 형태(커스텀 provider / 기본 provider 엔드포인트 오버라이드)와 설정 위치(`~/.codex/config.toml`, `.codex/config.toml`)를 함께 명시합니다.
- 방법 A 예시는 `model = "openai/gpt-5.2"`를 포함하고, 필요 시 `wire_api` 설정 가능성을 주석으로 안내합니다.

### 결과
- 참가자는 자신의 운영 방식에 맞춰 Codex 연결 전략을 선택할 수 있습니다.
- 운영진/참가자 모두가 동일한 설정 근거를 문서에서 확인할 수 있어 공정성과 추적 가능성이 강화됩니다.
