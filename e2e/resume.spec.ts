import { expect, test } from "@playwright/test";

test("Resume keeps profile, status and experience alongside the new collections", async ({ page }, testInfo) => {
  await page.addInitScript((theme) => localStorage.setItem("theme", theme), testInfo.project.name.endsWith("dark") ? "dark" : "light");
  await page.goto("/resume");
  await page.evaluate(() => document.fonts.ready);
  if (testInfo.project.name.endsWith("dark")) {
    await expect(page.locator("html")).toHaveClass(/dark/);
  } else {
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  }

  await expect(page.getByRole("heading", { name: /Hello, I'm Boa/ })).toBeVisible();
  const socials = page.getByRole("navigation", { name: "소셜 프로필" });
  await expect(socials.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/swallowedB");
  await expect(socials.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/boa-choi-5896a9241/");
  await expect.poll(async () => {
    const [location, email, icons] = await Promise.all([
      page.getByText("Seoul, South Korea", { exact: true }).boundingBox(),
      page.getByRole("link", { name: "musamea99@gmail.com" }).boundingBox(),
      socials.boundingBox(),
    ]);
    if (!location || !email || !icons || icons.x <= email.x + email.width) return Infinity;
    const contactCenter = (location.y + email.y + email.height) / 2;
    return Math.abs(icons.y + icons.height / 2 - contactCenter);
  }).toBeLessThan(2);
  await expect.poll(() => page.getByRole("heading", { name: /Hello, I'm Boa/ }).evaluate((heading) => {
    let opacity = 1;
    for (let element: Element | null = heading; element; element = element.parentElement) {
      opacity *= Number(getComputedStyle(element).opacity);
    }
    return opacity;
  })).toBe(1);
  await expect(page.getByRole("heading", { name: "Status", exact: true })).toBeVisible();
  const note = page.getByText("화면, 상태, 흐름을 안정적으로 구현하는 능력", { exact: true });
  await expect(note).toBeVisible();
  expect(await note.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(13);
  const status = page.getByRole("region", { name: "Status", exact: true });
  await status.evaluate((element) => element.scrollIntoView({ block: "start" }));
  await testInfo.attach("resume-status", { body: await status.screenshot({ animations: "disabled" }), contentType: "image/png" });
  await expect(page.getByText("Korea National Open University", { exact: true }).filter({ visible: true })).toBeVisible();
  await page.getByRole("button", { name: "Experience", exact: true }).click();
  await expect(page.getByText("Saltlux", { exact: true }).filter({ visible: true })).toBeVisible();
  await page.getByRole("button", { name: "Education", exact: true }).click();
  await expect(page.getByText("Korea National Open University", { exact: true }).filter({ visible: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ask Boa", exact: true })).toBeVisible();
  const learning = page.getByRole("region", { name: "최근 학습 후기" });
  await expect(learning).toBeVisible();
  await expect(page.getByRole("heading", { name: "Activity Case", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Badge", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /문제 구조화/ })).toHaveAttribute("href", "/posts/game-delta-time-fps-fix");
  await expect(page.getByRole("heading", { name: "Projects", exact: true })).toHaveCount(0);
  if ((page.viewportSize()?.width ?? 0) >= 1024) {
    const profile = await page.getByRole("heading", { name: /Hello, I'm Boa/ }).boundingBox();
    const learningBox = await learning.boundingBox();
    const experience = await page.getByRole("heading", { name: "경력 및 교육" }).boundingBox();
    expect(profile!.x).toBeLessThan(learningBox!.x);
    expect(learningBox!.x).toBeLessThan(experience!.x);
  }

  if (testInfo.project.name === "desktop-dark") {
    await page.setViewportSize({ width: 1440, height: 1060 });
  }
  await page.getByRole("heading", { name: /Hello, I'm Boa/ }).scrollIntoViewIfNeeded();
  if (testInfo.project.name === "desktop-dark") {
    await expect(page.locator("#profile").getByText("Software Developer", { exact: true })).toBeVisible({ timeout: 10_000 });
  }
  await testInfo.attach("resume-initial", { body: await page.screenshot({ fullPage: true, animations: "disabled" }), contentType: "image/png" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("Resume has no page overflow at narrow and short viewport sizes", async ({ page }) => {
  for (const viewport of [{ width: 320, height: 740 }, { width: 1280, height: 720 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/resume");
    await expect(page.getByRole("heading", { name: /Hello, I'm Boa/ })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole("button", { name: "Status score guide" }).click();
    const guide = page.getByRole("dialog", { name: "Status score guide" });
    await expect(guide).toBeInViewport({ ratio: 0.98 });
    await page.keyboard.press("Escape");
    await page.getByRole("heading", { name: "Activity Case", exact: true }).scrollIntoViewIfNeeded();
    await expect(page.getByRole("link", { name: /주사율에 따른 게임 속도 차이를/ })).toBeVisible();
  }
});

test("the Activity Case sleeve hides its record until hover or keyboard focus", async ({ page }, testInfo) => {
  await page.goto("/resume");
  const activity = page.getByRole("region", { name: "Activity Case" });
  const link = activity.getByRole("link", { name: /주사율에 따른 게임 속도 차이를/ });
  await link.scrollIntoViewIfNeeded();
  const discOverhang = () => link.evaluate((element) => {
    const disc = element.querySelector("[data-record-disc]")!.getBoundingClientRect();
    const sleeve = element.querySelector("[data-record-sleeve]")!.getBoundingClientRect();
    return disc.right - sleeve.right;
  });
  await expect.poll(discOverhang).toBeLessThanOrEqual(0);
  await testInfo.attach("resume-lp-default", { body: await activity.screenshot({ animations: "disabled" }), contentType: "image/png" });
  await link.hover();
  await expect.poll(discOverhang).toBeGreaterThan(15);
  await testInfo.attach("resume-lp-hover", { body: await activity.screenshot({ animations: "disabled" }), contentType: "image/png" });
  await page.mouse.move(0, 0);
  await page.keyboard.press("Tab");
  await link.focus();
  await expect.poll(discOverhang).toBeGreaterThan(15);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/resume\/cases\/comma-delta-time$/);
});
