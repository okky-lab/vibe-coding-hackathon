#!/usr/bin/env python3
"""Create hackathon submission docs and open an upstream PR using fork-only workflow."""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import re
import secrets
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Dict, Iterable, Optional, Sequence

DEFAULT_TARGET_REPO = "okky-lab/vibe-coding-hackathon"
DEFAULT_TARGET_REPO_URL = "https://github.com/okky-lab/vibe-coding-hackathon"
DEFAULT_BASE_BRANCH = "main"
DEFAULT_DOC_FILENAME = "vibecoding-result.mdx"
ALLOWED_FRONTMATTER_KEYS = {"title", "summary", "description", "full"}
REQUIRED_FRONTMATTER_KEYS = {"title", "summary", "description"}
REQUIRED_SECTION_HEADERS = [
    "## 프로젝트/팀 기본정보",
    "## 제품 링크 또는 실행 방법",
    "## 문제 정의 (Problem)",
    "## 해결 방식 (Solution)",
    "## 데모 설명 (3분 이내 기준)",
    "## 팀 소개 및 역할",
    "## 기술 스택",
    "## 실행/검증 방법",
    "## 라이선스/출처",
    "## AI 사용 여부 및 검증 방식",
    "## 제출 체크리스트",
]
ASSET_READMES = {
    "demo": "# Demo Assets\n\n데모 영상, 스크린샷, GIF 파일을 저장합니다.\n",
    "evidence": "# Evidence Assets\n\n실행/검증 결과 스크린샷 및 로그 파일을 저장합니다.\n",
    "team": "# Team Assets\n\n팀 소개 이미지, 프로필 이미지, 발표용 팀 자료를 저장합니다.\n",
}


class CommandError(RuntimeError):
    """Raised when a shell command fails."""


def run(
    cmd: Sequence[str],
    *,
    cwd: Optional[Path] = None,
    check: bool = True,
    capture_output: bool = True,
) -> str:
    result = subprocess.run(
        list(cmd),
        cwd=str(cwd) if cwd else None,
        text=True,
        capture_output=capture_output,
    )
    stdout = result.stdout.strip() if result.stdout else ""
    stderr = result.stderr.strip() if result.stderr else ""
    if check and result.returncode != 0:
        pretty_cmd = " ".join(cmd)
        raise CommandError(f"Command failed ({result.returncode}): {pretty_cmd}\n{stderr}")
    return stdout


def slugify(text: str) -> str:
    source = text.strip()
    value = source.lower()
    value = re.sub(r"[\s_]+", "-", value, flags=re.UNICODE)
    value = re.sub(r"[^\w-]+", "-", value, flags=re.UNICODE)
    value = re.sub(r"-{2,}", "-", value).strip("-_")
    if not value:
        digest = hashlib.sha1(source.encode("utf-8")).hexdigest()[:8]
        value = f"item-{digest}"
    return value


def normalize_text(value: str, default_value: str = "미기재") -> str:
    trimmed = value.replace("\\n", "\n").strip()
    return trimmed if trimmed else default_value


def sanitize_frontmatter_value(value: str) -> str:
    one_line = " ".join(value.splitlines()).strip()
    escaped = one_line.replace("\\", "\\\\").replace('"', '\\"')
    return escaped


def load_template(skill_root: Path) -> str:
    template_path = skill_root / "assets" / "templates" / DEFAULT_DOC_FILENAME
    if not template_path.exists():
        raise FileNotFoundError(f"Template not found: {template_path}")
    return template_path.read_text(encoding="utf-8")


def ensure_required_placeholders(template: str, placeholders: Iterable[str]) -> None:
    missing = [name for name in placeholders if f"__{name}__" not in template]
    if missing:
        joined = ", ".join(missing)
        raise ValueError(f"Template missing placeholder(s): {joined}")


def render_template(template: str, replacements: Dict[str, str]) -> str:
    rendered = template
    for key, value in replacements.items():
        rendered = rendered.replace(f"__{key}__", value)
    leftovers = sorted(set(re.findall(r"__[A-Z0-9_]+__", rendered)))
    if leftovers:
        joined = ", ".join(leftovers)
        raise ValueError(f"Unresolved template placeholder(s): {joined}")
    return rendered


def parse_frontmatter(content: str) -> Dict[str, str]:
    match = re.match(r"^---\n(.*?)\n---\n", content, re.DOTALL)
    if not match:
        raise ValueError("Document does not include valid YAML frontmatter.")
    frontmatter_lines = match.group(1).splitlines()
    data: Dict[str, str] = {}
    for line in frontmatter_lines:
        if ":" not in line:
            continue
        key, raw_value = line.split(":", 1)
        data[key.strip()] = raw_value.strip()
    return data


def validate_document(content: str) -> None:
    frontmatter = parse_frontmatter(content)
    keys = set(frontmatter.keys())
    unexpected = sorted(keys - ALLOWED_FRONTMATTER_KEYS)
    if unexpected:
        joined = ", ".join(unexpected)
        raise ValueError(f"Unexpected frontmatter keys: {joined}")

    missing = sorted(REQUIRED_FRONTMATTER_KEYS - keys)
    if missing:
        joined = ", ".join(missing)
        raise ValueError(f"Missing required frontmatter keys: {joined}")

    for required_header in REQUIRED_SECTION_HEADERS:
        if required_header not in content:
            raise ValueError(f"Missing required section: {required_header}")


def load_json(path: Path) -> Dict[str, object]:
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as file:
        raw = json.load(file)
    if not isinstance(raw, dict):
        raise ValueError(f"Invalid JSON object at {path}")
    return raw


def write_json(path: Path, payload: Dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(payload, file, ensure_ascii=False, indent=2)
        file.write("\n")


def ensure_meta_page(meta_path: Path, title: str, page: str) -> None:
    payload = load_json(meta_path)
    payload["title"] = payload.get("title", title) or title
    pages = payload.get("pages")
    if not isinstance(pages, list):
        pages = []
    normalized_pages = [item for item in pages if isinstance(item, str)]
    if page not in normalized_pages:
        normalized_pages.append(page)
    payload["pages"] = normalized_pages
    write_json(meta_path, payload)


def create_assets(doc_dir: Path) -> None:
    assets_root = doc_dir / "assets"
    for folder, content in ASSET_READMES.items():
        readme_path = assets_root / folder / "README.md"
        readme_path.parent.mkdir(parents=True, exist_ok=True)
        readme_path.write_text(content, encoding="utf-8")


def create_submission_artifacts(
    repo_root: Path,
    *,
    team_name: str,
    project_name: str,
    repo_url: str,
    demo_url_or_run_method: str,
    problem_definition: str,
    one_liner: str,
    team_roles: str,
    solution: str,
    tech_stack: str,
    run_verify: str,
    demo_summary: str,
    license_sources: str,
    ai_used: str,
    ai_validation_notes: str,
    presentation_url: str,
    extra_links: str,
    update_existing: bool,
) -> Path:
    skill_root = Path(__file__).resolve().parents[1]
    template = load_template(skill_root)

    required_placeholders = {
        "FRONTMATTER_TITLE",
        "FRONTMATTER_SUMMARY",
        "FRONTMATTER_DESCRIPTION",
        "TEAM_NAME",
        "PROJECT_NAME",
        "REPO_URL",
        "DEMO_URL_OR_RUN_METHOD",
        "PROBLEM_DEFINITION",
        "SOLUTION",
        "ONE_LINER",
        "DEMO_SUMMARY",
        "TEAM_ROLES",
        "TECH_STACK",
        "RUN_VERIFY",
        "LICENSE_SOURCES",
        "AI_USED",
        "AI_VALIDATION_NOTES",
        "PRESENTATION_URL",
        "EXTRA_LINKS",
    }
    ensure_required_placeholders(template, required_placeholders)

    team_slug = slugify(team_name)
    project_slug = slugify(project_name)

    docs_root = repo_root / "contents" / "docs"
    doc_dir = docs_root / "vibe-coding" / team_slug / project_slug
    doc_file = doc_dir / DEFAULT_DOC_FILENAME
    if doc_file.exists() and not update_existing:
        raise FileExistsError(
            f"Document already exists at {doc_file}. Re-run with --update to overwrite."
        )

    replacements = {
        "FRONTMATTER_TITLE": sanitize_frontmatter_value(f"{project_name} 결과 문서"),
        "FRONTMATTER_SUMMARY": sanitize_frontmatter_value(one_liner),
        "FRONTMATTER_DESCRIPTION": sanitize_frontmatter_value(
            f"{project_name} 제출 준비 및 제출 요건 충족 결과 문서"
        ),
        "TEAM_NAME": normalize_text(team_name),
        "PROJECT_NAME": normalize_text(project_name),
        "REPO_URL": normalize_text(repo_url),
        "DEMO_URL_OR_RUN_METHOD": normalize_text(demo_url_or_run_method),
        "PROBLEM_DEFINITION": normalize_text(problem_definition),
        "SOLUTION": normalize_text(solution, "해결 방식은 데모 설명 섹션을 참고하세요."),
        "ONE_LINER": normalize_text(one_liner),
        "DEMO_SUMMARY": normalize_text(demo_summary, "3분 이내 데모 흐름으로 준비했습니다."),
        "TEAM_ROLES": normalize_text(team_roles),
        "TECH_STACK": normalize_text(tech_stack, "미기재"),
        "RUN_VERIFY": normalize_text(run_verify, "README 실행/검증 방법을 참고하세요."),
        "LICENSE_SOURCES": normalize_text(license_sources, "해당 없음"),
        "AI_USED": normalize_text(ai_used, "사용함"),
        "AI_VALIDATION_NOTES": normalize_text(ai_validation_notes, "직접 구현 및 테스트로 검증"),
        "PRESENTATION_URL": normalize_text(presentation_url, "미기재"),
        "EXTRA_LINKS": normalize_text(extra_links, "미기재"),
    }

    rendered = render_template(template, replacements)
    validate_document(rendered)

    doc_dir.mkdir(parents=True, exist_ok=True)
    doc_file.write_text(rendered, encoding="utf-8")
    create_assets(doc_dir)

    ensure_meta_page(docs_root / "meta.json", "해카톤 문서", "vibe-coding")
    ensure_meta_page(docs_root / "vibe-coding" / "meta.json", "바이브 코딩 결과", team_slug)
    ensure_meta_page(docs_root / "vibe-coding" / team_slug / "meta.json", team_name, project_slug)
    ensure_meta_page(
        docs_root / "vibe-coding" / team_slug / project_slug / "meta.json",
        project_name,
        "vibecoding-result",
    )

    return doc_file


def ensure_gh_cli_and_auth() -> None:
    run(["gh", "--version"])
    run(["gh", "auth", "status"])


def ensure_fork(target_repo: str, login: str, *, create_if_missing: bool = True) -> str:
    target_repo_name = target_repo.split("/")[-1]
    fork_repo = f"{login}/{target_repo_name}"
    try:
        run(["gh", "repo", "view", fork_repo])
    except CommandError:
        if not create_if_missing:
            raise RuntimeError(
                f"Fork repository does not exist: {fork_repo}. "
                f"Create it first with: gh repo fork {target_repo} --clone=false --remote=false"
            )
        run(["gh", "repo", "fork", target_repo, "--clone=false", "--remote=false"])
    return fork_repo


def prepare_git_checkout(
    *,
    temp_root: Path,
    target_repo: str,
    base_branch: str,
    fork_repo: str,
    branch_name: str,
) -> Path:
    repo_path = temp_root / "repo"
    run(["git", "clone", f"https://github.com/{fork_repo}.git", str(repo_path)])
    run(["git", "remote", "add", "upstream", f"https://github.com/{target_repo}.git"], cwd=repo_path)
    run(["git", "fetch", "origin"], cwd=repo_path)
    run(["git", "fetch", "upstream", base_branch], cwd=repo_path)
    run(["git", "checkout", "-B", branch_name, f"upstream/{base_branch}"], cwd=repo_path)
    return repo_path


def create_branch_name(team_slug: str, project_slug: str) -> str:
    ts = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%d%H%M%S")
    suffix = secrets.token_hex(3)
    return f"submission/{team_slug}-{project_slug}-{ts}-{suffix}"


def ensure_git_identity(repo_path: Path) -> None:
    name = run(["git", "config", "--get", "user.name"], cwd=repo_path, check=False)
    email = run(["git", "config", "--get", "user.email"], cwd=repo_path, check=False)
    if name and email:
        return
    raise RuntimeError(
        "Git user identity is missing. Set user.name and user.email before running this script."
    )


def commit_changes(repo_path: Path, *, team_slug: str, project_slug: str, project_name: str, team_name: str) -> str:
    run(["git", "add", "contents/docs/meta.json", "contents/docs/vibe-coding"], cwd=repo_path)
    staged = run(["git", "status", "--short"], cwd=repo_path)
    if not staged:
        raise RuntimeError("No staged changes were found. Nothing to commit.")

    commit_message = "\n".join(
        [
            f"docs(submission): add {project_name} result document",
            "",
            "Why:",
            "- 해카톤 제출 준비/제출 요건을 단일 결과 문서로 공개하기 위해",
            "",
            "What:",
            f"- contents/docs/vibe-coding/{team_slug}/{project_slug}/vibecoding-result.mdx 생성",
            "- 제출용 assets 안내 파일 및 docs meta 네비게이션 갱신",
            "",
            "Verify:",
            "- create_submission_pr.py frontmatter/섹션 검증 통과",
            "- 중복 생성 방지 규칙과 경로 생성 규칙 점검",
            "",
            "AI:",
            f"- AI 도구를 사용해 초안을 생성하고, 최종 스크립트 동작은 {team_name} 팀 제출 흐름 기준으로 검증",
        ]
    )
    run(["git", "commit", "-m", commit_message], cwd=repo_path)
    return run(["git", "rev-parse", "HEAD"], cwd=repo_path)


def create_or_get_pr(
    *,
    repo_path: Path,
    target_repo: str,
    base_branch: str,
    login: str,
    branch_name: str,
    project_name: str,
    team_name: str,
) -> str:
    run(["git", "push", "--set-upstream", "origin", branch_name], cwd=repo_path)

    existing_pr = run(
        [
            "gh",
            "pr",
            "list",
            "--repo",
            target_repo,
            "--state",
            "open",
            "--head",
            f"{login}:{branch_name}",
            "--json",
            "url",
            "--jq",
            ".[0].url",
        ]
    )
    if existing_pr:
        return existing_pr

    pr_title = f"[Submission] {project_name}"
    pr_body = "\n".join(
        [
            f"Team: {team_name}",
            f"Project: {project_name}",
            "",
            "Why:",
            "- 해카톤 제출 결과 문서를 공개 저장소에 등록합니다.",
            "",
            "What:",
            "- vibecoding-result.mdx 및 제출 assets 구조를 생성/갱신했습니다.",
            "",
            "Verify:",
            "- frontmatter 필수 필드 검증",
            "- 요구 섹션 존재 검증",
            "- docs meta.json 네비게이션 반영 검증",
        ]
    )
    pr_url = run(
        [
            "gh",
            "pr",
            "create",
            "--repo",
            target_repo,
            "--base",
            base_branch,
            "--head",
            f"{login}:{branch_name}",
            "--title",
            pr_title,
            "--body",
            pr_body,
        ]
    )
    return pr_url.strip().splitlines()[-1]


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description=(
            "Generate hackathon submission docs and open a fork-based PR "
            f"to fixed upstream {DEFAULT_TARGET_REPO_URL}."
        )
    )
    p.add_argument("--team-name", required=True)
    p.add_argument("--project-name", required=True)
    p.add_argument("--repo-url", required=True)
    p.add_argument("--demo-url-or-run-method", required=True)
    p.add_argument("--problem-definition", required=True)
    p.add_argument("--one-liner", required=True)
    p.add_argument("--team-roles", required=True)

    p.add_argument("--solution", default="")
    p.add_argument("--tech-stack", default="")
    p.add_argument("--run-verify", default="")
    p.add_argument("--demo-summary", default="")
    p.add_argument("--license-sources", default="")
    p.add_argument("--ai-used", default="사용함", choices=["사용함", "사용하지 않음"])
    p.add_argument("--ai-validation-notes", default="")
    p.add_argument("--presentation-url", default="")
    p.add_argument("--extra-links", default="")

    p.add_argument("--base-branch", default=DEFAULT_BASE_BRANCH)
    p.add_argument("--update", action="store_true")
    p.add_argument("--keep-temp", action="store_true")
    p.add_argument(
        "--github-dry-run",
        action="store_true",
        help="Validate GitHub path (auth/fork/clone/render) without push, commit, or PR creation.",
    )
    p.add_argument(
        "--render-only-dir",
        help="Render docs into this local directory and skip all GitHub actions.",
    )
    return p


def run_github_dry_run(
    args: argparse.Namespace,
    *,
    target_repo: str,
    team_slug: str,
    project_slug: str,
) -> int:
    temp_dir = Path(tempfile.mkdtemp(prefix="hackathon-submission-gh-dry-run-"))
    login: Optional[str] = None
    branch_name: Optional[str] = None
    try:
        ensure_gh_cli_and_auth()
        login = run(["gh", "api", "user", "--jq", ".login"])
        run(["gh", "repo", "view", target_repo])
        fork_repo = ensure_fork(target_repo, login, create_if_missing=False)

        branch_name = create_branch_name(team_slug, project_slug)
        repo_path = prepare_git_checkout(
            temp_root=temp_dir,
            target_repo=target_repo,
            base_branch=args.base_branch,
            fork_repo=fork_repo,
            branch_name=branch_name,
        )

        created_doc = create_submission_artifacts(
            repo_path,
            team_name=args.team_name,
            project_name=args.project_name,
            repo_url=args.repo_url,
            demo_url_or_run_method=args.demo_url_or_run_method,
            problem_definition=args.problem_definition,
            one_liner=args.one_liner,
            team_roles=args.team_roles,
            solution=args.solution,
            tech_stack=args.tech_stack,
            run_verify=args.run_verify,
            demo_summary=args.demo_summary,
            license_sources=args.license_sources,
            ai_used=args.ai_used,
            ai_validation_notes=args.ai_validation_notes,
            presentation_url=args.presentation_url,
            extra_links=args.extra_links,
            update_existing=args.update,
        )

        staged_preview = run(["git", "status", "--short"], cwd=repo_path, check=False)
        changed_count = len([line for line in staged_preview.splitlines() if line.strip()])
        compare_url = (
            f"https://github.com/{target_repo}/compare/"
            f"{args.base_branch}...{login}:{branch_name}?expand=1"
        )

        print("[OK] GitHub dry-run completed.")
        print("[OK] No commit/push/PR was created.")
        print(f"[OK] Authenticated as: {login}")
        print(f"[OK] Fork repository: https://github.com/{fork_repo}")
        print(f"[OK] Planned branch: {branch_name}")
        print(f"[OK] Rendered document path (temp clone): {created_doc}")
        print(f"[OK] Changed files in dry-run: {changed_count}")
        print(f"[OK] Manual compare URL preview: {compare_url}")
        return 0
    except Exception as error:
        print(f"[ERROR] {error}", file=sys.stderr)
        if login and branch_name:
            compare_url = (
                f"https://github.com/{target_repo}/compare/"
                f"{args.base_branch}...{login}:{branch_name}?expand=1"
            )
            print(f"[FALLBACK] Compare URL preview: {compare_url}", file=sys.stderr)
        return 1
    finally:
        if args.keep_temp:
            print(f"[INFO] Temporary directory kept: {temp_dir}")
        else:
            shutil.rmtree(temp_dir, ignore_errors=True)


def main() -> int:
    args = parser().parse_args()
    target_repo = DEFAULT_TARGET_REPO
    try:
        team_slug = slugify(args.team_name)
        project_slug = slugify(args.project_name)
    except Exception as error:
        print(f"[ERROR] {error}", file=sys.stderr)
        return 1

    if args.render_only_dir and args.github_dry_run:
        print("[ERROR] --render-only-dir and --github-dry-run cannot be used together.", file=sys.stderr)
        return 1

    if args.github_dry_run:
        return run_github_dry_run(
            args,
            target_repo=target_repo,
            team_slug=team_slug,
            project_slug=project_slug,
        )

    if args.render_only_dir:
        try:
            output_root = Path(args.render_only_dir).resolve()
            created_doc = create_submission_artifacts(
                output_root,
                team_name=args.team_name,
                project_name=args.project_name,
                repo_url=args.repo_url,
                demo_url_or_run_method=args.demo_url_or_run_method,
                problem_definition=args.problem_definition,
                one_liner=args.one_liner,
                team_roles=args.team_roles,
                solution=args.solution,
                tech_stack=args.tech_stack,
                run_verify=args.run_verify,
                demo_summary=args.demo_summary,
                license_sources=args.license_sources,
                ai_used=args.ai_used,
                ai_validation_notes=args.ai_validation_notes,
                presentation_url=args.presentation_url,
                extra_links=args.extra_links,
                update_existing=args.update,
            )
            print("[OK] Render-only mode completed.")
            print(f"[OK] Document path: {created_doc}")
            return 0
        except Exception as error:
            print(f"[ERROR] {error}", file=sys.stderr)
            return 1

    temp_dir = Path(tempfile.mkdtemp(prefix="hackathon-submission-"))
    repo_path: Optional[Path] = None
    branch_name: Optional[str] = None
    login: Optional[str] = None
    commit_sha: Optional[str] = None
    try:
        ensure_gh_cli_and_auth()
        login = run(["gh", "api", "user", "--jq", ".login"])
        fork_repo = ensure_fork(target_repo, login, create_if_missing=True)
        branch_name = create_branch_name(team_slug, project_slug)
        repo_path = prepare_git_checkout(
            temp_root=temp_dir,
            target_repo=target_repo,
            base_branch=args.base_branch,
            fork_repo=fork_repo,
            branch_name=branch_name,
        )
        ensure_git_identity(repo_path)

        created_doc = create_submission_artifacts(
            repo_path,
            team_name=args.team_name,
            project_name=args.project_name,
            repo_url=args.repo_url,
            demo_url_or_run_method=args.demo_url_or_run_method,
            problem_definition=args.problem_definition,
            one_liner=args.one_liner,
            team_roles=args.team_roles,
            solution=args.solution,
            tech_stack=args.tech_stack,
            run_verify=args.run_verify,
            demo_summary=args.demo_summary,
            license_sources=args.license_sources,
            ai_used=args.ai_used,
            ai_validation_notes=args.ai_validation_notes,
            presentation_url=args.presentation_url,
            extra_links=args.extra_links,
            update_existing=args.update,
        )

        commit_sha = commit_changes(
            repo_path,
            team_slug=team_slug,
            project_slug=project_slug,
            project_name=args.project_name,
            team_name=args.team_name,
        )
        pr_url = create_or_get_pr(
            repo_path=repo_path,
            target_repo=target_repo,
            base_branch=args.base_branch,
            login=login,
            branch_name=branch_name,
            project_name=args.project_name,
            team_name=args.team_name,
        )

        print("[OK] Submission document generated and PR created.")
        print(f"[OK] Document path: {created_doc}")
        print(f"[OK] Commit SHA: {commit_sha}")
        print(f"[OK] Branch: {branch_name}")
        print(f"[OK] PR URL: {pr_url}")
        return 0
    except Exception as error:
        print(f"[ERROR] {error}", file=sys.stderr)
        if login and branch_name:
            compare_url = (
                f"https://github.com/{target_repo}/compare/"
                f"{args.base_branch}...{login}:{branch_name}?expand=1"
            )
            if repo_path and repo_path.exists():
                if not commit_sha:
                    commit_sha = run(
                        ["git", "rev-parse", "HEAD"],
                        cwd=repo_path,
                        check=False,
                    )
            print("[FALLBACK] PR 자동 생성 실패 시 아래 정보를 사용하세요.", file=sys.stderr)
            if commit_sha:
                print(f"[FALLBACK] Commit SHA: {commit_sha}", file=sys.stderr)
            print(f"[FALLBACK] Branch: {branch_name}", file=sys.stderr)
            print(f"[FALLBACK] Manual PR URL: {compare_url}", file=sys.stderr)
        return 1
    finally:
        if args.keep_temp:
            print(f"[INFO] Temporary directory kept: {temp_dir}")
        else:
            shutil.rmtree(temp_dir, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
