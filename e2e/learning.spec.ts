import { expect, test } from "@playwright/test";

test("Learning offers honest empty state and keyboard filters", async ({ page }, testInfo) => {
  await page.addInitScript((theme) => localStorage.setItem("theme", theme), testInfo.project.name.endsWith("dark") ? "dark" : "light");
  await page.goto("/learning");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { level: 1, name: "Learning" })).toBeVisible();
  await expect(page.getByText("아직 공개된 학습 후기가 없습니다.")).toBeVisible();
  await expect(page.getByRole("link", { name: "All", exact: true })).toHaveAttribute("aria-current", "page");
  await testInfo.attach("learning-list", { body: await page.screenshot({ animations: "disabled" }), contentType: "image/png" });
  const books = page.getByRole("link", { name: "Books", exact: true });
  await books.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/type=book/);
  await expect(page.getByRole("link", { name: "Books", exact: true })).toHaveAttribute("aria-current", "page");
  await page.goto("/learning?type=unexpected");
  await expect(page.getByRole("link", { name: "All", exact: true })).toHaveAttribute("aria-current", "page");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://b0o0a.com/learning");
});

test("Resume links to archive while unpublished Learning remains inaccessible", async ({ page, request }) => {
  await page.goto("/resume");
  const shelf = page.getByRole("region", { name: "최근 학습 후기" });
  await shelf.scrollIntoViewIfNeeded();
  await shelf.getByRole("link", { name: /전체 보기/ }).click();
  await expect(page).toHaveURL(/\/learning$/);
  expect((await request.get("/learning/learning-review-draft")).status()).toBe(404);
  const html = await page.content();
  expect(html).not.toContain("학습 후기 작성 대기 초안");
  expect(html).not.toContain("__PRIVATE_LEARNING_DRAFT__");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("https://b0o0a.com/learning</loc>");
  expect(sitemap).not.toContain("learning-review-draft");
});

test("the Resume folder indexes link to their Learning categories", async ({ page }, testInfo) => {
  await page.goto("/resume");
  const folder = page.getByRole("region", { name: "최근 학습 후기" });
  await expect(folder.locator("svg[data-learning-folder-art]")).toBeVisible();
  for (const [name, type, edge] of [
    ["Book", "book", "left"],
    ["Conference", "conference", "right"],
    ["Course", "course", "left"],
  ] as const) {
    const index = folder.getByRole("link", { name, exact: true });
    await expect(index).toHaveAttribute("href", `/learning?type=${type}`);
    const gap = await index.evaluate((tab, side) => Math.abs(
      tab.getBoundingClientRect()[side] - tab.parentElement!.getBoundingClientRect()[side],
    ), edge);
    expect(gap).toBeLessThan(1);
    await index.click({ trial: true });
  }
  await testInfo.attach("learning-folder-svg", { body: await folder.screenshot({ animations: "disabled" }), contentType: "image/png" });
  await folder.getByRole("link", { name: "Course", exact: true }).click();
  await expect(page).toHaveURL(/\/learning\?type=course$/);
  await expect(page.getByRole("link", { name: "Courses", exact: true })).toHaveAttribute("aria-current", "page");
});
