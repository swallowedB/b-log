import { expect, test } from "@playwright/test";

test("public case exposes its source, canonical URL and readable detail", async ({ page }, testInfo) => {
  await page.addInitScript((theme) => localStorage.setItem("theme", theme), testInfo.project.name.endsWith("dark") ? "dark" : "light");
  await page.goto("/resume/cases/comma-delta-time");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { level: 1, name: /Delta Time/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Problem", exact: true })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://b0o0a.com/resume/cases/comma-delta-time");
  await expect(page.getByRole("navigation", { name: "관련 근거" }).getByRole("link", { name: /모니터 주사율/ })).toHaveAttribute("href", "/posts/game-delta-time-fps-fix");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.getByRole("heading", { level: 1, name: /Delta Time/ })).toBeInViewport();
  await testInfo.attach("case-detail", { body: await page.screenshot({ animations: "disabled" }), contentType: "image/png" });
  const references = page.getByRole("navigation", { name: "관련 근거" });
  await references.scrollIntoViewIfNeeded();
  await testInfo.attach("case-evidence", { body: await references.screenshot({ animations: "disabled" }), contentType: "image/png" });
});

test("private and unknown case paths return 404 and stay out of sitemap and HTML", async ({ page, request }) => {
  for (const slug of ["plaist-auth-state", "roome-dock-interaction", "does-not-exist"]) {
    expect((await request.get(`/resume/cases/${slug}`)).status()).toBe(404);
  }
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/resume/cases/comma-delta-time");
  expect(sitemap).not.toContain("plaist-auth-state");
  await page.goto("/resume/cases/comma-delta-time");
  expect(await page.content()).not.toContain("__RESUME_PRIVATE_CASE_DRAFT__");
  expect(await page.content()).not.toContain("인증과 상태 동기화 문제 해결");
  expect(await page.content()).not.toContain("기존 공개 글을 근거로 담당 범위와 판단을 검수한 뒤 작성할 초안입니다.");
});
