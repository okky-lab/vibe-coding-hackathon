# Submission Requirements Mapping

This reference maps the generated `vibecoding-result.mdx` sections to repository requirements.

## Source Mapping

| Source | Requirement | Generated Section |
| --- | --- | --- |
| `contents/docs/fairness-guide.mdx` 4.1 | 스킬 기반 제출 템플릿 생성/검증 | Entire document generation + validation gates |
| `contents/docs/fairness-guide.mdx` 4.2 | 수동 제출 이슈 템플릿과 동일 핵심 정보 | 프로젝트/팀 정보, 문제/해결, 기술 스택, 실행/검증, AI 사용 내역, 체크리스트 |
| `contents/docs/how-to-participate.mdx` 4 | 제출 준비 항목 포함 | 제품 링크/실행 방법, 문제 정의, 데모 설명, 팀 소개/역할 |

## Required Frontmatter

- `title: string`
- `summary: string`
- `description: string`
- `full?: boolean`

## Required Output Path

- `contents/docs/vibe-coding/<team-slug>/<project-slug>/vibecoding-result.mdx`

## Required Assets

- `assets/demo/README.md`
- `assets/evidence/README.md`
- `assets/team/README.md`

