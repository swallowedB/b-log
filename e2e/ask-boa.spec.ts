import { expect, test } from "@playwright/test";

test("Ask Boa opens from the homepage and keeps the conversation after following a source", async ({ page }, testInfo) => {
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Ask Boa", exact: true });
  const chat = page.getByRole("dialog", { name: "Ask Boa", exact: true });
  await expect(launcher).toBeInViewport();
  await expect(chat).toBeHidden();
  await testInfo.attach("ask-boa-launcher", { body: await page.screenshot({ animations: "disabled" }), contentType: "image/png" });
  await launcher.click();
  await expect(chat).toBeInViewport();
  await testInfo.attach("ask-boa-open-home", { body: await page.screenshot({ animations: "disabled" }), contentType: "image/png" });
  const input = chat.getByRole("textbox", { name: "Boa에게 질문" });
  await input.fill("작성 중인 질문");
  await chat.getByRole("button", { name: /주사율에 따라/ }).click();
  const source = chat.getByRole("link", { name: /주사율에 따른 게임 속도 차이/ });
  await source.click();
  await expect(page).toHaveURL(/\/resume\/cases\/comma-delta-time$/);
  await expect(chat).toBeHidden();
  await launcher.click();
  await expect(chat.getByText(/Delta Time을 계산해/)).toBeVisible();
  await expect(input).toHaveValue("작성 중인 질문");
  await page.keyboard.press("Escape");
  await expect(chat).toBeHidden();
  await expect(launcher).toBeFocused();
});

test("suggested experience answers need no API and survive responsive changes", async ({ page }, testInfo) => {
  let chatRequests = 0;
  page.on("request", (request) => { if (request.url().includes("/api/resume/chat")) chatRequests++; });
  await page.addInitScript((theme) => localStorage.setItem("theme", theme), testInfo.project.name.endsWith("dark") ? "dark" : "light");
  await page.goto("/resume");
  await page.getByRole("button", { name: "Ask Boa", exact: true }).click();
  const chat = page.getByRole("dialog", { name: "Ask Boa", exact: true });
  await expect(chat).toHaveCount(1);
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
  await expect(chat).toHaveCount(1);
  await expect(log.getByText(/Delta Time을 계산해/)).toBeVisible();
  expect(chatRequests).toBe(0);
});

test("composer protects Japanese and Korean composition and supports normal Enter", async ({ page }) => {
  await page.goto("/resume");
  await page.getByRole("button", { name: "Ask Boa", exact: true }).click();
  const chat = page.getByRole("dialog", { name: "Ask Boa", exact: true });
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
