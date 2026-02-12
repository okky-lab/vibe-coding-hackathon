import { expect, test } from "@playwright/test";

test("랜딩 페이지에 기본 브랜딩과 핵심 섹션이 노출된다", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("OKKY 바이브 코딩 해카톤").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "행사 취지와 목적" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "행사 일정 타임라인" })).toBeVisible();
});

test("행사 일정 타임라인 4단계가 표시된다", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "행사 일정 타임라인" })).toBeVisible();
  await expect(page.getByText("체크인 / 오리엔테이션")).toBeVisible();
  await expect(page.getByText("빌드 스프린트")).toBeVisible();
  await expect(page.getByText("결과 공유 / 데모")).toBeVisible();
  await expect(page.getByText("마무리 / 네트워킹")).toBeVisible();
});

test("FAQ 미리보기와 전용 FAQ 페이지가 동작한다", async ({ page }) => {
  await page.goto("/");
  const logoCloud = page.getByTestId("logo-cloud-01");
  await expect(logoCloud).toBeVisible();

  const faqHeading = page.getByRole("heading", { name: "FAQ" });
  const logoBox = await logoCloud.boundingBox();
  const faqBox = await faqHeading.boundingBox();
  expect(logoBox).not.toBeNull();
  expect(faqBox).not.toBeNull();
  expect((logoBox?.y ?? 0) + (logoBox?.height ?? 0)).toBeLessThan(faqBox?.y ?? 0);

  await expect(faqHeading).toBeVisible();
  await expect(page.getByText("개발 경험이 꼭 있어야 하나요?")).toBeVisible();

  await page.getByRole("link", { name: "전체 FAQ 보기" }).click();
  await expect(page).toHaveURL(/\/faq$/);
  await expect(page.getByRole("heading", { name: "행사 FAQ" })).toBeVisible();
  await expect(page.getByText("혼자 참여해도 괜찮을까요?")).toBeVisible();
});

test("운영팀 섹션과 컨택 CTA가 노출된다", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "운영팀 구성" })).toBeVisible();
  await expect(page.getByText("프로그램 총괄")).toBeVisible();
  await expect(page.getByText("운영 진행")).toBeVisible();
  await expect(page.getByText("테크 지원")).toBeVisible();
  await expect(page.getByText("커뮤니티/네트워킹")).toBeVisible();

  const communityCta = page.getByTestId("okky-community-cta");
  await expect(
    communityCta.getByRole("heading", { name: "OKKY 개발자 커뮤니티에 합류하세요" }),
  ).toBeVisible();
  await expect(communityCta.getByRole("img", { name: "OKKY 로고" })).toBeVisible();

  const mailLink = communityCta.locator('a[href="mailto:event@okky.kr"]').first();
  await expect(mailLink).toBeVisible();
});

test("문서 인덱스와 대표 문서 렌더링이 유지된다", async ({ page }) => {
  await page.goto("/docs");

  const docs = [
    { title: "개요", slug: "overview" },
    { title: "일정", slug: "schedule" },
    { title: "참가방법", slug: "how-to-participate" },
    { title: "규칙", slug: "rules" },
    { title: "행동강령", slug: "code-of-conduct" },
    { title: "심사기준 및 시상", slug: "judging-criteria" },
    { title: "오픈라우터 설정", slug: "openrouter-setup" },
    { title: "FAQ", slug: "faq" },
  ];

  for (const doc of docs) {
    const link = page.locator(`a[href="/docs/${doc.slug}"]`).first();
    await expect(link).toContainText(doc.title);
    await expect(link).toBeVisible();
  }

  await page.goto("/docs/overview");
  await expect(page.getByRole("heading", { name: "해카톤 개요" }).first()).toBeVisible();

  await page.goto("/docs/code-of-conduct");
  await expect(page.getByRole("heading", { name: "행동강령" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "공정성" }).first()).toBeVisible();
});

test("없는 문서 경로는 404로 처리된다", async ({ page }) => {
  const response = await page.goto("/docs/non-existent");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("페이지를 찾을 수 없습니다")).toBeVisible();
});

test("/docs, /faq 페이지에도 공통 헤더와 푸터가 노출된다", async ({ page }) => {
  await page.goto("/docs");
  await expect(page.getByText("OKKY 바이브 코딩 해카톤").first()).toBeVisible();
  await expect(page.getByText("AI 시대를 위해 먼저 나아가는 국내 최대 개발자 커뮤니티 OKKY가 진행하는 바이브 코딩 해커톤 공식 페이지입니다.")).toBeVisible();

  await page.goto("/faq");
  await expect(page.getByText("OKKY 바이브 코딩 해카톤").first()).toBeVisible();
  await expect(page.getByText("AI 시대를 위해 먼저 나아가는 국내 최대 개발자 커뮤니티 OKKY가 진행하는 바이브 코딩 해커톤 공식 페이지입니다.")).toBeVisible();
});
