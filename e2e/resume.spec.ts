import { expect, test } from "@playwright/test";

test("Resume keeps profile, education, experience and projects accessible", async ({ page }, testInfo) => {
  await page.addInitScript((theme) => localStorage.setItem("theme", theme), testInfo.project.name.endsWith("dark") ? "dark" : "light");
  await page.goto("/resume");
  await page.evaluate(() => document.fonts.ready);
  if (testInfo.project.name.endsWith("dark")) {
    await expect(page.locator("html")).toHaveClass(/dark/);
  } else {
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  }

  await expect(page.getByRole("heading", { name: /Hello, I'm Boa/ })).toBeVisible();
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

  await page.getByRole("heading", { name: /Hello, I'm Boa/ }).scrollIntoViewIfNeeded();
  await testInfo.attach("resume-initial", { body: await page.screenshot({ fullPage: true, animations: "disabled" }), contentType: "image/png" });
  const projects = page.getByRole("heading", { name: "Projects", exact: true });
  await projects.scrollIntoViewIfNeeded();
  await expect(projects).toBeVisible();
  await expect(page.getByRole("link", { name: /Comma/ })).toBeVisible();
  await testInfo.attach("resume-projects", { body: await page.screenshot({ fullPage: true, animations: "disabled" }), contentType: "image/png" });
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
    await page.getByRole("heading", { name: "Projects", exact: true }).scrollIntoViewIfNeeded();
    await expect(page.getByRole("link", { name: /Comma/ })).toBeVisible();
  }
});
