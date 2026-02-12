---
name: hackathon-submission
description: Generate a submission-ready result document at contents/docs/vibe-coding/<team-slug>/<project-slug>/vibecoding-result.mdx and open a fork-based PR to okky-lab/vibe-coding-hackathon. Use when users ask to prepare final hackathon submission docs, satisfy fairness-guide submission rules, satisfy how-to-participate submission preparation, or register a project submission with safe GitHub permissions.
---

# Hackathon Submission

## Overview

Create a single `vibecoding-result.mdx` document and required assets under `contents/docs/vibe-coding`, then open a PR to `okky-lab/vibe-coding-hackathon` via fork workflow.

## Required Inputs

Collect these required fields before running automation.

- `team_name`
- `project_name`
- `repo_url`
- `demo_url_or_run_method`
- `problem_definition`
- `one_liner`
- `team_roles`

Collect these recommended fields if available.

- `tech_stack`
- `run_verify`
- `demo_summary`
- `license_sources`
- `ai_used` (`사용함` or `사용하지 않음`)
- `ai_validation_notes`

Optional fields:

- `presentation_url`
- `extra_links`

## Execute Automation

Run the script from the skill root.

```bash
python3 scripts/create_submission_pr.py \
  --team-name "팀 OKKY" \
  --project-name "VibeShip" \
  --repo-url "https://github.com/example/project" \
  --demo-url-or-run-method "https://example.com/demo" \
  --problem-definition "해결하려는 문제를 작성" \
  --one-liner "한 줄 소개" \
  --team-roles "- 홍길동: FE\n- 김철수: BE"
```

For local rendering only (without GitHub PR):

```bash
python3 scripts/create_submission_pr.py \
  --team-name "팀 OKKY" \
  --project-name "VibeShip" \
  --repo-url "https://github.com/example/project" \
  --demo-url-or-run-method "README 실행 방법 참고" \
  --problem-definition "문제 정의" \
  --one-liner "한 줄 소개" \
  --team-roles "- 홍길동: FE" \
  --render-only-dir /tmp/hackathon-submission-test
```

## Output Contract

The script must create:

- `contents/docs/vibe-coding/<team-slug>/<project-slug>/vibecoding-result.mdx`
- `contents/docs/vibe-coding/<team-slug>/<project-slug>/assets/demo/README.md`
- `contents/docs/vibe-coding/<team-slug>/<project-slug>/assets/evidence/README.md`
- `contents/docs/vibe-coding/<team-slug>/<project-slug>/assets/team/README.md`

The script must ensure navigation metadata:

- `contents/docs/meta.json` includes `vibe-coding`
- `contents/docs/vibe-coding/meta.json` includes `<team-slug>`
- `contents/docs/vibe-coding/<team-slug>/meta.json` includes `<project-slug>`
- `contents/docs/vibe-coding/<team-slug>/<project-slug>/meta.json` includes `vibecoding-result`

## Validation Rules

Block generation if any validation fails.

- Frontmatter keys must be only `title`, `summary`, `description`, optional `full`
- `title`, `summary`, `description` must exist
- Required submission sections must exist
- Existing document path must fail by default (unless `--update` is provided)

## Failure Fallback

When PR creation fails after commit/push, always return:

- Created commit SHA
- Pushed fork branch
- Manual PR compare URL

## GitHub Permission Collision Prevention (Final)

Always follow these rules:

1. Never push directly to `okky-lab/vibe-coding-hackathon`.
2. Always use `fork -> fork branch -> upstream PR`.
3. Use one dedicated submission account and verify with `gh auth status`.
4. Use branch pattern:
   - `submission/<team>-<project>-<YYYYMMDDHHmmss>-<6hex>`
5. Before PR creation, check for branch/PR duplication.

