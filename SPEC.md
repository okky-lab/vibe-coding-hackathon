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
- LLM 안내용 텍스트 엔드포인트(`/llms.txt`)

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
- 팀 목록 정렬은 `submittedAt`(등록 시각) 기준 내림차순이어야 하며, 시각이 없거나 파싱 불가한 항목은 목록 하단에 배치되어야 합니다.

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
- `오픈라우터 설정` 문서(`openrouter-setup`)의 3번 섹션(도구별 설정 가이드) 하단에는 `현재 지원 불가능한 도구` 하위 섹션이 있어야 합니다.
- 해당 하위 섹션은 아래 도구를 하나의 번호로 묶어 안내해야 합니다.
  - Gemini CLI
  - Windsurf
  - Antigravity
- 각 도구는 "OpenRouter API Key를 직접 입력해 연결하는 방식은 현재 지원하지 않음" 상태를 명시해야 합니다.

### FR-015 오픈라우터 설정 문서 구조 정리
- `오픈라우터 설정` 문서(`openrouter-setup`)의 문서 범위 섹션은 "사용 가능"과 "사용 불가능(지금은 OpenRouter에 바로 연결할 수 없는 도구)" 구간으로 도구 목록을 분리해야 합니다.
- 사용 가능 목록은 `Codex`, `Claude CLI`, `Cursor`, `OpenCode`, `Careti`를 포함해야 합니다.
- 사용 불가능 목록은 `Gemini CLI`, `Windsurf`, `Antigravity`를 포함해야 합니다.
- 문서 본문에서 `OpenRouter API Key 발급` 절은 제거되어야 합니다.
- 도구 공통 입력값의 Model ID 안내는 OpenRouter 최신 모델 목록 페이지(`https://openrouter.ai/models?order=newest`)를 참조하도록 명시해야 합니다.

### FR-016 참가방법 문서의 제출 스킬 설치 경로 통합
- `참가방법` 문서(`how-to-participate`)의 `5.1 스킬 설치 (1회)`는 Codex/Claude/Gemini 동시 호환 경로를 안내해야 합니다.
- 문서는 아래 자동 발견 경로를 명시해야 합니다.
  - Codex: `.agents/skills/hackathon-submission`
  - Gemini CLI: `.agents/skills/hackathon-submission` (`.gemini/skills` alias)
  - Claude Code: `.claude/skills/hackathon-submission`
- 문서는 레포 준비용 설치 절차로 `skills/hackathon-submission`을 `.agents/skills`, `.claude/skills`로 복사하는 명령을 포함해야 합니다.
- 문서는 임의 프로젝트 설치 절차로 GitHub installer 명령(`install-skill-from-github.py`)과 `.claude/skills` 복사 단계를 포함해야 합니다.
- 문서는 설치 후 Codex/Claude/Gemini 재시작 안내를 포함해야 합니다.

### FR-017 문서 컬렉션의 증빙 자산 디렉터리 제외
- 문서 수집 설정(`source.config.ts`)의 `docs` 컬렉션은 `contents/docs` 하위의 `assets` 디렉터리를 페이지 수집 대상에서 제외해야 합니다.
- 제외 대상에는 참가자 증빙용 파일의 안내 문서(`assets/**/README.md`)가 포함되어야 합니다.
- `assets` 하위 마크다운 파일은 문서 페이지 schema(`title` 필수)의 검증 대상이 아니어야 합니다.

### FR-018 팀 페이지 내 바이브 코딩 결과 카드 통합
- `/team` 경로는 `contents/team` 기반의 단일 카드 목록으로 팀/제출 프로젝트를 표시해야 합니다.
- 바이브 코딩 제출 결과도 기존 팀 프로젝트 카드와 동일한 카드 형식으로 같은 목록에 포함되어야 합니다.
- 바이브 코딩 제출 카드는 `contents/team/submission-<team-slug>-<project-slug>.mdx` 데이터를 통해 렌더링되어야 합니다.
- `/vibe-coding` 경로는 독립 카드 목록을 렌더링하지 않고 `/team`으로 연결되어야 합니다.

### FR-019 제출 결과 문서 템플릿 간소화
- `hackathon-submission` 스킬이 생성하는 `vibecoding-result.mdx`의 frontmatter `title`에는 `결과 문서` 표현을 포함하지 않아야 합니다.
- `hackathon-submission` 스킬이 생성하는 `vibecoding-result.mdx`의 frontmatter `description`에는 `제출 준비 및 제출 요건 충족 결과 문서` 고정 문구를 사용하지 않아야 합니다.
- `발표 자료`, `추가 링크` 등 선택 섹션은 값이 비어있거나 `미기재`인 경우 문서에 렌더링하지 않아야 합니다.
- `vibecoding-result.mdx` 본문에는 `제출 체크리스트` 섹션을 렌더링하지 않아야 합니다.
- `vibecoding-result.mdx` 본문에는 `AI 사용 여부 및 검증 방식` 섹션을 사용자 노출 목적의 결과 문서에서 렌더링하지 않아야 합니다.

### FR-020 docs 사이드바의 바이브 코딩 구간 시각적 분리
- `/docs` 좌측 사이드바에서 `바이브 코딩 결과` 항목 바로 위에 구분선(`separator`)이 표시되어야 합니다.
- 해당 구분선 바로 아래에는 `/team`으로 이동하는 `바이브 코딩 목록` 메뉴 항목이 표시되어야 합니다.
- `바이브 코딩 목록` 메뉴는 내부 링크(`/team`)로 동작해야 합니다.

### FR-021 바이브 코딩 결과 문서 경로 단일 레벨화
- `contents/docs/vibe-coding` 하위 결과 문서는 팀/프로젝트 중첩 경로 없이 `/<project-slug>.mdx` 단일 레벨로 생성되어야 합니다.
- 제출 결과 자산 경로는 `contents/docs/vibe-coding/assets/<project-slug>/{demo,evidence,team}` 구조를 사용해야 합니다.
- `hackathon-submission` 스킬은 위 단일 레벨 문서/자산 경로를 기본 출력 규약으로 사용해야 합니다.
- `contents/docs/vibe-coding/meta.json`의 `pages`에는 팀 슬러그가 아닌 프로젝트 슬러그가 직접 등록되어야 합니다.

### FR-022 팀 카드 상세 문서 라우팅
- `/team`의 프로젝트 카드(이미지/제목)를 클릭하면 해당 카드의 원본 팀 제출 문서 slug 경로(`/team/<submission-doc-slug>`)로 이동해야 합니다.
- 팀 제출 상세 경로(`/team/<submission-doc-slug>`)는 `contents/team/*.mdx` 본문과 TOC를 렌더링해야 합니다.
- 팀 제출 상세 페이지 제목은 `projectName`을 우선 사용하고, 값이 없으면 `name`을 사용해야 합니다.
- 팀 제출 상세 페이지 설명은 `projectSummary`를 우선 사용하고, 값이 없으면 `bio`를 사용해야 합니다.

### FR-023 GNB FAQ 링크 경로 통일
- 상단 GNB의 `FAQ` 메뉴는 `href="/docs/faq"` 경로로 이동해야 합니다.
- 상단 GNB의 `FAQ` 메뉴는 레거시 FAQ 경로(`/faq`)를 직접 가리키지 않아야 합니다.

### FR-024 운영 메인 브랜치의 테스트 제출 데이터 비노출
- 운영 메인 브랜치의 `contents/team` 목록에는 검증 목적의 테스트 제출 샘플(`submission-chlrb-test-project`)이 포함되지 않아야 합니다.
- `/team` 페이지는 실제 제출/팀 데이터만 표시해야 합니다.

### FR-025 LLM 안내 문서 `llms.txt` 라우트
- 시스템은 LLM 안내 문서 경로 `/llms.txt`를 제공해야 합니다.
- `/llms.txt` 응답의 MIME 타입은 `text/plain; charset=utf-8`이어야 합니다.
- `/llms.txt` 본문은 정적 고정 텍스트여야 하며, 아래 3개 섹션을 포함해야 합니다.
  - 행사 기본소개
  - 사전 준비사항
  - 제출 준비사항
- `/llms.txt`의 `사전 준비사항` 섹션은 저장소 운영 원칙 중심으로 제공해야 하며, `필수 준비물` 및 `사전 권장 준비` 하위 목록을 포함하지 않아야 합니다.
- `/llms.txt` 본문 내 참조 링크는 절대 URL이어야 하며, 기본 도메인은 `https://vibecoding.okky.kr`이어야 합니다.
- 운영 문서 변경 시 `/llms.txt` 본문은 수동 동기화 정책을 따른다.

### FR-026 shadcn 커스텀 레지스트리의 GooseUI 네임스페이스 추가
- `components.json`의 `registries`에는 GooseUI 네임스페이스 `@gooseui`가 포함되어야 합니다.
- `@gooseui`는 `https://gooseui.pro/r/{name}.json` 경로를 사용해야 합니다.

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
- AC-017: `/docs/openrouter-setup` 문서의 3번 섹션 하단에는 `현재 지원 불가능한 도구` 하위 섹션이 있어야 하며, Gemini CLI, Windsurf, Antigravity의 OpenRouter API Key 직접 입력 연결 미지원 상태가 함께 명시되어야 합니다.
- AC-018: `/docs/openrouter-setup` 문서의 1번 섹션은 도구를 "사용 가능"과 "사용 불가능(지금은 OpenRouter에 바로 연결할 수 없는 도구)"으로 분리해 표시해야 합니다.
- AC-019: `/docs/openrouter-setup` 문서에는 `OpenRouter API Key 발급` 섹션이 없어야 하며, 공통 입력값의 Model ID는 `https://openrouter.ai/models?order=newest` 참조 안내로 표기되어야 합니다.
- AC-020: `/docs/how-to-participate`의 `5.1 스킬 설치 (1회)`에는 Codex/Gemini/Claude의 자동 발견 경로 3개가 모두 명시되어야 합니다.
- AC-021: `/docs/how-to-participate`의 `5.1 스킬 설치 (1회)`에는 `skills/hackathon-submission`을 `.agents/skills`, `.claude/skills`로 복사하는 설치 명령이 포함되어야 합니다.
- AC-022: `/docs/how-to-participate`의 `5.1 스킬 설치 (1회)`에는 GitHub installer 기반 설치 명령(`--url .../skills/hackathon-submission`, `--dest .agents/skills`)과 `.claude/skills` 복사 및 재시작 안내가 포함되어야 합니다.
- AC-023: `contents/docs/**/assets/**` 하위의 `README.md`가 frontmatter 없이 존재해도 `pnpm build`는 docs schema 오류 없이 완료되어야 합니다.
- AC-024: `/team`에 접속하면 `contents/team` 단일 카드 목록에서 일반 팀 카드와 제출 결과 카드가 동일한 카드 형식으로 함께 표시되어야 합니다.
- AC-025: `/vibe-coding`에 접속하면 독립 카드 목록 대신 `/team`으로 이동되어야 합니다.
- AC-026: `hackathon-submission` 스킬로 생성된 결과 문서의 `title`에는 `"결과 문서"` 문자열이 포함되지 않아야 한다.
- AC-027: `hackathon-submission` 스킬로 생성된 결과 문서에는 값이 `미기재`인 선택 섹션(예: `발표 자료`, `추가 링크`)이 노출되지 않아야 한다.
- AC-028: `hackathon-submission` 스킬로 생성된 결과 문서에는 `제출 체크리스트` 섹션이 포함되지 않아야 한다.
- AC-029: `hackathon-submission` 스킬로 생성된 결과 문서에는 `AI 사용 여부 및 검증 방식` 섹션이 포함되지 않아야 한다.
- AC-030: `/docs/vibe-coding`를 포함한 docs 사이드바에서 `바이브 코딩 결과` 항목 바로 위에 구분선이 보여야 한다.
- AC-031: 구분선 아래에 `바이브 코딩 목록` 메뉴가 추가되어 `/team`으로 이동해야 한다.
- AC-032: `hackathon-submission` 스킬 실행 시 `contents/team/submission-<team-slug>-<project-slug>.mdx` 파일이 생성되어 `/team` 카드 목록에 바로 반영되어야 한다.
- AC-033: `hackathon-submission` 스킬 실행 시 결과 문서는 `contents/docs/vibe-coding/<project-slug>.mdx` 경로로 생성되어야 하며 팀/프로젝트 중첩 디렉터리를 만들지 않아야 한다.
- AC-034: `hackathon-submission` 스킬 실행 시 자산은 `contents/docs/vibe-coding/assets/<project-slug>/demo|evidence|team/README.md`로 생성되어야 하고, `contents/docs/vibe-coding/meta.json`에는 `<project-slug>`가 등록되어야 한다.
- AC-035: `/team` 카드 목록은 `submittedAt`이 최신인 항목부터 표시되어야 하며, `submittedAt`이 없거나 파싱 불가한 항목은 마지막 구간에 표시되어야 한다.
- AC-036: `/team`에서 제출 카드의 이미지 또는 프로젝트명을 클릭하면 해당 카드의 slug 경로(`/team/<submission-doc-slug>`)로 이동해야 한다.
- AC-037: `/team/<submission-doc-slug>` 페이지에는 대응되는 `contents/team/*.mdx` 본문과 TOC가 렌더링되어야 한다.
- AC-038: `/team/<submission-doc-slug>` 메타데이터는 제목(`projectName` 우선)과 설명(`projectSummary` 우선)을 노출해야 한다.
- AC-039: 상단 GNB에서 `FAQ` 메뉴 클릭 시 사용자는 `/docs/faq` 문서 페이지로 이동해야 한다.
- AC-040: 운영 메인 브랜치의 `contents/team`에는 `submission-chlrb-test-project.mdx`가 존재하지 않아야 하며, `/team` 목록에 `test-project` 카드가 노출되지 않아야 한다.
- AC-041: 사용자가 `/llms.txt`에 접속하면 HTTP 200 응답과 `text/plain; charset=utf-8` 헤더를 확인할 수 있어야 한다.
- AC-042: `/llms.txt` 본문에는 `행사 기본소개`, `사전 준비사항`, `제출 준비사항` 3개 섹션 제목이 모두 포함되어야 한다.
- AC-043: `/llms.txt` 본문에는 `https://vibecoding.okky.kr` 도메인을 사용하는 절대 URL 참조 링크가 포함되어야 한다.
- AC-044: `/llms.txt` 본문은 UTF-8 한글 텍스트가 깨지지 않고 출력되어야 한다.
- AC-045: `/llms.txt`의 `사전 준비사항` 섹션에는 `필수 준비물`, `사전 권장 준비` 문자열이 포함되지 않아야 한다.
- AC-046: `components.json`의 `registries`에 `@gooseui: https://gooseui.pro/r/{name}.json` 항목이 존재해야 한다.
