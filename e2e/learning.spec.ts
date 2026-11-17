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
  const art = folder.locator("svg[data-learning-folder-art]");
  await expect(art).toBeVisible();
  const heading = folder.getByRole("heading", { name: "Learning", exact: true });
  const browse = folder.getByRole("link", { name: /전체 보기/ });
  const [headingBox, artBox, browseBox, folderBox] = await Promise.all([
    heading.boundingBox(),
    art.boundingBox(),
    browse.boundingBox(),
    folder.boundingBox(),
  ]);
  expect(headingBox!.y + headingBox!.height).toBeLessThanOrEqual(artBox!.y);
  expect(browseBox!.y).toBeGreaterThanOrEqual(artBox!.y + artBox!.height);
  expect(Math.abs(browseBox!.x + browseBox!.width - folderBox!.x - folderBox!.width)).toBeLessThan(1);
  await expect(folder.getByText("배운 것과 나의 관점, 실제 적용의 기록")).toHaveCount(0);
  await expect(folder.getByText("학습 후기를 차곡차곡 정리하고 있습니다.")).toHaveCount(0);
  await expect(art).toHaveAttribute("viewBox", "0 0 624 380");
  await expect(art.locator("foreignObject")).toHaveCount(5);
  await expect(art.locator("filter")).toHaveCount(4);
  const gradientStops = await art.locator("linearGradient stop[stop-color]").evaluateAll((stops) =>
    stops.map((stop) => {
      const color = document.createElement("span").style;
      color.color = stop.getAttribute("stop-color")!;
      return { authored: color.color, rendered: getComputedStyle(stop).stopColor };
    }),
  );
  expect(gradientStops.length).toBeGreaterThan(0);
  expect(gradientStops.map(({ rendered }) => rendered)).toEqual(gradientStops.map(({ authored }) => authored));
  await expect(art).toHaveCSS("filter", "none");
  const ratio = await art.evaluate((svg) => {
    const box = svg.getBoundingClientRect();
    return box.width / box.height;
  });
  expect(ratio).toBeCloseTo(624 / 380, 2);
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
