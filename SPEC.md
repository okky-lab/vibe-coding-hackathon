# 기능적 요구사항 정의서 (FRD)

## 1. 문서 목적
- 본 문서는 OKKY 바이브 코딩 해카톤 사이트의 현재 구현 기준 기능 요구사항을 정의합니다.
- 구현과 직접 무관한 운영 기록, 기술 도입 배경, 일회성 검증 결과는 본 문서 범위에서 제외합니다.

## 2. 범위

### 2.1 포함 범위
- 사용자 진입 랜딩 페이지
- 문서 인덱스 및 문서 상세 열람 기능
- 문서 콘텐츠(frontmatter + MDX 본문) 기반 렌더링
- 존재하지 않는 문서 경로의 오류 처리

### 2.2 제외 범위
- 신청/결제/인증/회원가입 기능
- 관리자 백오피스 기능
- 실시간 데이터 연동 기능

## 3. 기능 요구사항

### FR-001 라우팅
- 시스템은 아래 경로를 제공해야 합니다.
  - `/`: 랜딩 페이지
  - `/docs`: 문서 인덱스 페이지
  - `/docs/[slug]`: 문서 상세 페이지
- 시스템은 존재하지 않는 문서 slug 접근 시 404 페이지를 반환해야 합니다.

### FR-002 랜딩 페이지
- 랜딩 페이지는 행사명과 소개 문구를 노출해야 합니다.
- 랜딩 페이지는 문서로 이동하는 CTA(`href="/docs"`)를 제공해야 합니다.
- 랜딩 페이지는 GitHub 버튼을 제공해야 하며, 링크는 아래 주소로 고정되어야 합니다.
  - `https://github.com/okky-lab/vibe-coding-hackathon`

### FR-003 공통 레이아웃 및 내비게이션
- 사이트 레이아웃은 상단 내비게이션에 `홈`, `문서` 링크를 제공해야 합니다.
- 사이트 공통 배경은 Aurora 시각 효과를 사용해야 합니다.
- Aurora는 라이트/다크 모드에 따라 색상 세트를 분기해야 합니다.
- 사이트 페이지(`/(site)`) 하단에는 공통 Footer를 노출해야 합니다.

### FR-004 문서 인덱스 페이지
- 문서 인덱스는 문서 컬렉션의 전체 문서를 목록으로 노출해야 합니다.
- 각 문서 카드에는 문서 제목을 표시해야 합니다.
- 각 문서 카드의 요약 텍스트는 `description`을 우선 사용하고, 없을 경우 `summary`를 사용해야 합니다.
- 각 문서 카드는 해당 상세 경로로 이동 가능해야 합니다.

### FR-005 문서 상세 페이지
- 문서 상세는 frontmatter `title`을 페이지 제목으로 표시해야 합니다.
- 문서 상세는 frontmatter `description`을 우선 표시하고, 없으면 `summary`를 표시해야 합니다.
- 문서 본문(MDX)과 TOC를 함께 렌더링해야 합니다.

### FR-006 문서 콘텐츠 모델
- 문서 컬렉션 경로는 `contents/docs`여야 합니다.
- 문서 frontmatter는 아래 스키마를 따라야 합니다.
  - `title: string` (필수)
  - `description?: string`
  - `summary?: string`
  - `full?: boolean`

### FR-007 문서 작성 규칙
- `/docs` 문서 본문에는 중복 제목 방지를 위해 H1(`#`)를 사용하지 않아야 합니다.
- 문서 제목은 frontmatter `title`을 통해 화면에 렌더링되어야 합니다.

### FR-008 일정 문서 요구사항
- `일정` 문서는 단일 행사일 기준 타임테이블 표를 제공해야 합니다.
- 행사일은 `2026년 02월 21일(토요일)`로 명시되어야 합니다.
- 타임테이블은 `13:00~18:00` 범위를 기준으로 구성되어야 합니다.
- 타임테이블 컬럼에는 `일차`, `권장 시간대`를 포함하지 않아야 합니다.

### FR-009 팀 제출 목록 페이지
- 시스템은 팀 제출 목록 페이지 경로 `/team`을 제공해야 합니다.
- 시스템은 기존 경로 `/teams` 요청을 `/team`으로 리다이렉트해야 합니다.
- 시스템은 `contents/team`의 MDX 문서를 읽어 팀 카드 목록으로 렌더링해야 합니다.
- 팀 카드는 최소한 다음 정보를 노출해야 합니다.
  - 팀명(`name`)
  - 팀 설명(`bio`)
  - 프로젝트명(`projectName`)
  - 프로젝트 요약(`projectSummary`)
  - 제출 시각(`submittedAt`)
- 팀 카드는 이미지 영역을 포함한 카드 UI로 렌더링해야 하며, 이미지가 없을 경우 대체 배경을 표시해야 합니다.
- 팀 카드는 프로젝트 외부 링크(`projectUrl`, `demoUrl`, `repositoryUrl`)를 버튼 형태로 제공해야 합니다.
- 팀 카드는 `CardAction` 영역에 배지(`Badge`)를 노출하고, 하단 액션(`CardFooter`)에 단일 메인 버튼(`Button`)을 제공해야 합니다.
- 팀 카드 하단 액션의 메인 버튼 우측에는 저장소 링크용 GitHub 아이콘 버튼을 제공해야 합니다(`repositoryUrl` 존재 시).
- 팀 목록 그리드는 `md` 이상 뷰포트에서 3열로 표시되어야 합니다.

### FR-010 오픈라우터 설정 문서 요구사항
- `오픈라우터 설정` 문서(`openrouter-setup`)는 Codex 설정 섹션을 포함해야 합니다.
- Codex 설정 섹션은 아래 지원 형태를 명시해야 합니다.
  - `config.toml` 기반 커스텀 provider 정의 가능
  - `OPENAI_BASE_URL` 기반 기본 OpenAI provider 엔드포인트 오버라이드 가능
- Codex 설정 섹션은 아래 설정 위치를 명시해야 합니다.
  - 유저 설정: `~/.codex/config.toml`
  - 프로젝트 설정(선택): `.codex/config.toml`
- Codex 설정 섹션은 아래 두 가지 연결 방식을 모두 안내해야 합니다.
  - 방법 A(권장): `OPENROUTER_API_KEY` 환경변수 + `~/.codex/config.toml`의 `model_provider = "openrouter"` 설정
  - 방법 B: `OPENAI_BASE_URL`을 `https://openrouter.ai/api/v1`로 지정하는 OpenAI provider 호환 설정
- 방법 A 예시는 `model = "openai/gpt-5.2"`와 `model_provider = "openrouter"`를 포함해야 하며, 필요 시 `wire_api` 설정 가능성을 안내해야 합니다.

### FR-011 오픈라우터 설정 문서의 Claude Code 요구사항
- `오픈라우터 설정` 문서(`openrouter-setup`)는 Claude Code 설정 섹션을 포함해야 합니다.
- Claude Code 섹션은 아래 지원 형태를 명시해야 합니다.
  - 환경변수 기반 연결
  - `settings.json`의 `env` 필드를 사용하는 파일 기반 연결
- Claude Code 섹션은 OpenRouter 연결 필수 환경변수 4개를 명시해야 합니다.
  - `OPENROUTER_API_KEY`
  - `ANTHROPIC_BASE_URL=https://openrouter.ai/api`
  - `ANTHROPIC_AUTH_TOKEN`
  - `ANTHROPIC_API_KEY=""` (명시적 빈 문자열)
- Claude Code 섹션은 아래 두 가지 설정 방법을 모두 안내해야 합니다.
  - 방법 A: 셸 프로필 영구 적용(zsh/bash/fish)
  - 방법 B: `~/.claude/settings.json` 또는 `.claude/settings.local.json`의 `env` 구성
- Claude Code 섹션은 Windows PowerShell 설정(세션/영구)과 실행/검증/트러블슈팅 절차를 포함해야 합니다.

### FR-012 오픈라우터 설정 문서의 Cursor 요구사항
- `오픈라우터 설정` 문서(`openrouter-setup`)는 Cursor 설정 섹션을 포함해야 합니다.
- Cursor 섹션은 아래 지원 형태를 명시해야 합니다.
  - OpenAI API Key + Base URL override 방식으로 OpenRouter 연결 가능
- Cursor 섹션은 OpenRouter 안내 기준의 설정 경로와 절차를 포함해야 합니다.
  - 경로: `Settings -> Cursor Settings -> Models`
  - `API Keys` 섹션 설정: OpenAI API Key 활성화, OpenRouter 키 입력, `Override OpenAI Base URL` 활성화, Base URL `https://openrouter.ai/api/v1` 지정
  - 모델 추가 단계에서 OpenRouter 모델 선택 안내

### FR-013 오픈라우터 설정 문서의 OpenCode 요구사항
- `오픈라우터 설정` 문서(`openrouter-setup`)는 OpenCode 설정 섹션을 포함해야 합니다.
- OpenCode 섹션은 아래 지원 형태를 명시해야 합니다.
  - `/connect` 명령 기반 OpenRouter provider 연결 가능
  - `/models` 명령 기반 모델 선택 및 `opencode.json` 기반 모델/옵션 확장 가능
- OpenCode 섹션은 아래 설정 절차를 포함해야 합니다.
  - `/connect` 실행 후 OpenRouter 선택 및 API Key 입력
  - `/models` 실행을 통한 모델 선택
- OpenCode 섹션은 `opencode.json` 기반 예시를 포함해야 합니다.
  - 모델 추가 예시(`provider.openrouter.models.<model-id>`)
  - 모델별 provider 라우팅 옵션 예시(`order`, `allow_fallbacks`)

### FR-014 오픈라우터 설정 문서의 직접 연결 미지원 도구 고지
- `오픈라우터 설정` 문서(`openrouter-setup`)는 아래 도구의 직접 OpenRouter API Key 연결 미지원 상태를 명시해야 합니다.
  - Gemini CLI
  - Windsurf
  - Antigravity
- 각 섹션은 "현재 OpenRouter API Key 직접 연결 미지원" 문구를 포함해야 합니다.

### FR-015 오픈라우터 설정 문서 구조 정리
- `오픈라우터 설정` 문서(`openrouter-setup`)의 문서 범위 섹션은 "사용 가능"과 "사용 불가능(OpenRouter API Key 직접 연결 기준)" 구간으로 도구 목록을 분리해야 합니다.
- 사용 가능 목록은 `Codex`, `Claude CLI`, `Cursor`, `OpenCode`, `Careti`를 포함해야 합니다.
- 사용 불가능 목록은 `Gemini CLI`, `Windsurf`, `Antigravity`를 포함해야 합니다.
- 문서 본문에서 `OpenRouter API Key 발급` 절은 제거되어야 합니다.
- 도구 공통 입력값의 Model ID 안내는 OpenRouter 최신 모델 목록 페이지(`https://openrouter.ai/models?order=newest`)를 참조하도록 명시해야 합니다.

## 4. 문서 목록 요구사항 (`contents/docs`)
- 개요 (`overview`)
- 일정 (`schedule`)
- 참가방법 (`how-to-participate`)
- 참가규칙 (`rules`)
- 공정성 가이드 (`fairness-guide`)
- 행동강령 (`code-of-conduct`)
- 심사기준 (`judging-criteria`)
- 오픈라우터 설정 (`openrouter-setup`)
- FAQ (`faq`)

## 5. 수용 기준 (Acceptance Criteria)
- AC-001: 사용자가 `/`에 접속하면 행사 소개, `/docs` 이동 버튼, 고정 GitHub 링크 버튼을 확인할 수 있어야 합니다.
- AC-002: 사용자가 `/docs`에 접속하면 문서 컬렉션의 모든 문서를 카드 형태로 확인할 수 있어야 합니다.
- AC-003: `/docs` 카드 설명 텍스트는 `description`이 있으면 이를 우선 노출해야 합니다.
- AC-004: 사용자가 `/docs/{slug}`에 접속하면 문서 제목, 설명, 본문, TOC를 확인할 수 있어야 합니다.
- AC-005: 존재하지 않는 문서 경로(`/docs/non-existent`)는 404 페이지를 반환해야 합니다.
- AC-006: 일정 문서에는 `2026년 02월 21일(토요일)`, `13:00~18:00` 기준이 명시된 타임테이블 표가 존재해야 합니다.
- AC-007: 사용자가 `/team`에 접속하면 `contents/team` 데이터 기반의 이미지 카드 목록을 확인할 수 있어야 합니다.
- AC-008: 사용자가 `/teams`에 접속하면 `/team`으로 이동되어 동일한 목록 화면을 확인할 수 있어야 합니다.
- AC-009: `/docs/openrouter-setup` 문서의 Codex 섹션에는 지원 형태(커스텀 provider/엔드포인트 오버라이드)와 설정 위치(`~/.codex/config.toml`, `.codex/config.toml`)가 명시되어야 합니다.
- AC-010: `/docs/openrouter-setup` 문서의 Codex 섹션에는 방법 A/B 설정 절차, `model = "openai/gpt-5.2"` 예시, `https://openrouter.ai/api/v1` 엔드포인트가 명시되어야 합니다.
- AC-011: `/docs/openrouter-setup` 문서의 Claude Code 섹션에는 4개 필수 환경변수(`OPENROUTER_API_KEY`, `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_API_KEY=""`)와 `https://openrouter.ai/api` 엔드포인트가 명시되어야 합니다.
- AC-012: `/docs/openrouter-setup` 문서의 Claude Code 섹션에는 셸 프로필 방식, `settings.json` 방식, Windows PowerShell 방식, `/status` 기반 검증 절차가 포함되어야 합니다.
- AC-013: `/docs/openrouter-setup` 문서의 Cursor 섹션에는 지원 형태(OpenAI API Key + Base URL override)와 설정 경로(`Settings -> Cursor Settings -> Models`)가 명시되어야 합니다.
- AC-014: `/docs/openrouter-setup` 문서의 Cursor 섹션에는 `API Keys` 단계별 설정(OpenAI API Key 활성화, OpenRouter 키, `Override OpenAI Base URL`, `https://openrouter.ai/api/v1`)과 모델 추가 안내가 포함되어야 합니다.
- AC-015: `/docs/openrouter-setup` 문서의 OpenCode 섹션에는 `/connect` 기반 OpenRouter 연결, API Key 입력, `/models` 실행 단계가 명시되어야 합니다.
- AC-016: `/docs/openrouter-setup` 문서의 OpenCode 섹션에는 `opencode.json` 모델 추가 예시와 provider 옵션(`order`, `allow_fallbacks`) 예시가 포함되어야 합니다.
- AC-017: `/docs/openrouter-setup` 문서에는 Gemini CLI, Windsurf, Antigravity의 OpenRouter API Key 직접 연결 미지원 상태가 명시되어야 합니다.
- AC-018: `/docs/openrouter-setup` 문서의 1번 섹션은 도구를 "사용 가능"과 "사용 불가능(OpenRouter API Key 직접 연결 기준)"으로 분리해 표시해야 합니다.
- AC-019: `/docs/openrouter-setup` 문서에는 `OpenRouter API Key 발급` 섹션이 없어야 하며, 공통 입력값의 Model ID는 `https://openrouter.ai/models?order=newest` 참조 안내로 표기되어야 합니다.
