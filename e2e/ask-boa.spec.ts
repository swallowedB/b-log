import { expect, test } from "@playwright/test";

test("suggested experience answers need no API and survive responsive changes", async ({ page }, testInfo) => {
  let chatRequests = 0;
  page.on("request", (request) => { if (request.url().includes("/api/resume/chat")) chatRequests++; });
  await page.addInitScript((theme) => localStorage.setItem("theme", theme), testInfo.project.name.endsWith("dark") ? "dark" : "light");
  await page.goto("/resume");
  const chat = page.getByRole("region", { name: "Ask Boa", exact: true });
  await expect(chat).toHaveCount(1);
  await chat.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  await testInfo.attach("ask-boa-initial", { body: await chat.screenshot({ animations: "disabled" }), contentType: "image/png" });
  await chat.getByRole("button", { name: /주사율에 따라/ }).click();
  const log = chat.getByRole("log");
  await expect(log.getByText(/Delta Time을 계산해/)).toBeVisible();
  await expect(log.getByText("Boa · 준비된 답변", { exact: true })).toBeInViewport();
  await expect(log.getByRole("link", { name: /주사율에 따른 게임 속도 차이/ })).toHaveAttribute("href", "/resume/cases/comma-delta-time");
  await testInfo.attach("ask-boa-answer", { body: await chat.screenshot({ animations: "disabled" }), contentType: "image/png" });
  await chat.getByRole("button", { name: "어떤 개발자인가요?", exact: true }).click();
  await expect(log.getByRole("article").last().getByText("Boa · 준비된 답변", { exact: true })).toBeInViewport();
  await page.setViewportSize({ width: testInfo.project.name.startsWith("desktop") ? 390 : 1440, height: 900 });
  await expect(page.locator("#ask-boa")).toHaveCount(1);
  await expect(log.getByText(/Delta Time을 계산해/)).toBeVisible();
  expect(chatRequests).toBe(0);
});

test("composer protects Japanese and Korean composition and supports normal Enter", async ({ page }) => {
  await page.goto("/resume");
  const chat = page.getByRole("region", { name: "Ask Boa", exact: true });
  const input = chat.getByRole("textbox", { name: "Boa에게 질문" });
  await input.fill("자기소개");
  await input.dispatchEvent("compositionstart");
  await input.press("Enter");
  await expect(chat.getByRole("article")).toHaveCount(0);
  await input.dispatchEvent("compositionend");
  await input.press("Enter");
  await expect(chat.getByRole("article")).toHaveCount(2);
  await expect(input).toHaveValue("");
});
