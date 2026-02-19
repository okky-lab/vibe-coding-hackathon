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

## ADR-003 오픈라우터 설정 문서의 Claude Code 연결 방식 구체화

- 상태: 승인
- 날짜: 2026-02-19

### 배경
- 기존 Claude 섹션은 개략 설명 중심이라 실제 연결 시 필요한 환경변수/파일 위치/검증 절차의 재현성이 낮았습니다.
- 같은 문서 내 Codex 섹션은 상세 포맷(지원 형태/설정 위치/방법 A/B)을 갖추고 있어, 도구 간 가이드 품질을 맞출 필요가 있었습니다.

### 결정
- `contents/docs/openrouter-setup.mdx`의 Claude 섹션을 Codex와 동일한 포맷으로 재작성합니다.
- OpenRouter 연결 필수 환경변수 4개(`OPENROUTER_API_KEY`, `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_API_KEY=""`)를 명시합니다.
- 설정 방식은 아래 두 가지를 모두 제공하도록 문서화합니다.
  - 방법 A: 셸 프로필 기반 영구 적용(zsh/bash/fish)
  - 방법 B: Claude Code `settings.json`의 `env` 필드 기반 파일 설정
- Windows PowerShell 설정, `claude` 실행 절차, `/status` 기반 검증, 자주 발생하는 오류 해결 절차를 함께 포함합니다.

### 결과
- Claude Code 사용자는 OS/설정 선호도에 따라 동일한 기준으로 OpenRouter 연결을 재현할 수 있습니다.
- 문서 내 Codex/Claude 섹션의 구조와 문장 톤이 통일되어 학습 비용이 낮아집니다.

## ADR-004 오픈라우터 설정 문서의 Cursor 연결 절차 구체화

- 상태: 승인
- 날짜: 2026-02-19

### 배경
- 기존 Cursor 섹션은 API Key/Base URL/Model 나열 수준으로, 실제 UI 경로와 단계가 부족해 따라 하기 어려운 상태였습니다.
- Codex/Claude 섹션이 이미 절차 중심으로 정리되어 있어, Cursor도 같은 수준의 구체성이 필요했습니다.

### 결정
- `contents/docs/openrouter-setup.mdx`의 Cursor 섹션을 절차형 가이드로 재작성합니다.
- 지원 형태를 OpenAI API Key + Base URL override 방식으로 명시합니다.
- OpenRouter 안내 기준으로 아래 설정 절차를 문서화합니다.
  - `Settings -> Cursor Settings -> Models` 이동
  - `API Keys`에서 OpenAI API Key 활성화, OpenRouter 키 입력, `Override OpenAI Base URL` 활성화
  - Base URL `https://openrouter.ai/api/v1` 설정 및 모델 추가 단계 안내
- 추가 참고 링크로 OpenRouter의 Cursor 모델 사용 공지 페이지를 포함합니다.

### 결과
- Cursor 사용자는 UI 클릭 경로와 입력 항목을 기준으로 OpenRouter 연결을 빠르게 재현할 수 있습니다.
- 도구별 섹션 품질이 일관되어 문서 학습/검증 비용이 낮아집니다.

## ADR-005 오픈라우터 설정 문서의 OpenCode 연결 방식 구체화

- 상태: 승인
- 날짜: 2026-02-19

### 배경
- 기존 OpenCode 섹션은 API Key/Base URL/Model 항목만 제시해 실제 CLI 연결 순서를 따라가기가 어려웠습니다.
- Codex/Claude/Cursor 섹션이 절차형 포맷으로 정리되어 있어, OpenCode도 동일한 수준의 구체성과 톤이 필요했습니다.

### 결정
- `contents/docs/openrouter-setup.mdx`의 OpenCode 섹션을 절차형 가이드로 재작성합니다.
- OpenCode 연결 핵심 흐름(`/connect` -> OpenRouter 선택 -> API Key 입력 -> `/models` 선택)을 명시합니다.
- `opencode.json` 예시를 아래 2가지로 포함합니다.
  - 모델 추가 예시(`provider.openrouter.models.<model-id>`)
  - 모델별 provider 라우팅 옵션 예시(`order`, `allow_fallbacks`)

### 결과
- OpenCode 사용자는 명령 중심 절차와 설정 파일 예시를 기준으로 OpenRouter 연결을 빠르게 재현할 수 있습니다.
- 오픈라우터 설정 문서의 도구별 섹션이 동일한 형식으로 정렬되어 사용성과 검증성이 개선됩니다.

## ADR-006 오픈라우터 설정 문서의 직접 연결 미지원 도구 명시

- 상태: 승인
- 날짜: 2026-02-19

### 배경
- 도구별 지원 범위가 변하면서 일부 항목의 연결 가능 여부가 실제와 다르게 인식될 위험이 있었습니다.
- 특히 Gemini CLI, Windsurf, Antigravity는 OpenRouter API Key 직접 연결 미지원 상태를 명확히 고지할 필요가 있었습니다.

### 결정
- `contents/docs/openrouter-setup.mdx`에 Gemini CLI 섹션을 추가하고, Windsurf/Antigravity 섹션을 미지원 안내 형태로 변경합니다.
- 세 도구 모두에 "현재 OpenRouter API Key 직접 연결 미지원" 상태를 명시합니다.
- 오해를 줄이기 위해 기존 연결 절차/입력값 나열을 제거하고 지원 여부 중심으로 정리합니다.

### 결과
- 참가자/운영진이 지원 범위를 동일하게 인지할 수 있어 설정 실패와 검증 혼선을 줄일 수 있습니다.
- 문서가 최신 도구 지원 상태를 더 정확히 반영하게 됩니다.

## ADR-007 오픈라우터 설정 문서의 범위/공통입력 정리

- 상태: 승인
- 날짜: 2026-02-19

### 배경
- 문서 상단에 행사장에서 키를 개별 발급한다는 안내가 이미 있어, 본문의 별도 키 발급 절이 중복 정보를 만들고 있었습니다.
- 참가자 입장에서 어떤 도구가 즉시 사용 가능한지 문서 첫 구간에서 빠르게 판단하기 어려웠습니다.
- 공통 입력값의 모델 예시가 고정 문자열로 제시되어 최신 모델 확인 경로를 놓칠 수 있었습니다.

### 결정
- `contents/docs/openrouter-setup.mdx`의 문서 범위 섹션에서 도구 목록을 `사용 가능`과 `사용 불가능(지금은 OpenRouter에 바로 연결할 수 없는 도구)`으로 분리합니다.
- 사용 불가능 그룹은 `Gemini CLI`, `Windsurf`, `Antigravity`로 고정하고, 나머지는 사용 가능 그룹으로 명시합니다.
- 중복되는 `OpenRouter API Key 발급` 섹션을 제거합니다.
- 도구 공통 입력값의 Model ID 안내는 OpenRouter 모델 목록 페이지(`https://openrouter.ai/models?order=newest`) 참조 방식으로 변경합니다.

### 결과
- 참가자는 문서 초반에서 지원 가능 여부를 즉시 판별할 수 있습니다.
- 키 발급 절차 중복이 제거되어 문서 구조가 단순해집니다.
- 모델 선택 기준이 최신 목록 링크로 통일되어 유지보수성과 정확성이 향상됩니다.

## ADR-008 오픈라우터 설정 문서의 미지원 도구 섹션 통합 배치

- 상태: 승인
- 날짜: 2026-02-19

### 배경
- 도구별 설정 가이드에서 미지원 도구가 개별 번호로 흩어져 있어, 사용 가능한 도구 흐름이 중간에 끊기는 문제가 있었습니다.
- 참가자가 먼저 따라야 할 설정 절차(지원 도구)와 참고 정보(미지원 도구)를 분리해 가독성을 높일 필요가 있었습니다.

### 결정
- `contents/docs/openrouter-setup.mdx`의 3번 섹션에서 미지원 도구를 하나의 하위 번호(`현재 지원 불가능한 도구`)로 통합합니다.
- 통합된 미지원 도구 하위 섹션은 3번 섹션의 가장 하단에 배치합니다.
- 해당 하위 섹션에는 `Gemini CLI`, `Windsurf`, `Antigravity`의 OpenRouter API Key 직접 입력 연결 미지원 상태를 함께 명시합니다.

### 결과
- 사용 가능한 도구 설정 순서(Codex/Claude/Cursor/OpenCode/Careti)가 연속적으로 정리되어 따라 하기 쉬워집니다.
- 미지원 도구 정보는 별도 묶음으로 확인할 수 있어 문서 스캔 속도와 이해도가 개선됩니다.
