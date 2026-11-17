import { expect, test } from "@playwright/test";

test("mock AI and cached answers disclose their origin and public source", async ({ page }, testInfo) => {
  let calls = 0;
  await page.route("**/api/resume/chat", async (route) => {
    calls++;
    await route.fulfill({ json: { mode: calls === 1 ? "ai" : "cache", answer: "화면 검증용 고정 응답입니다. 공개 COMMA 기록은 프레임마다 고정된 이동량을 경과 시간 기준으로 보정한 과정을 설명합니다. 별도의 정량 성능 개선 수치는 제시하지 않습니다.", sources: [{ id: "case:comma-delta-time", type: "case", title: "Delta Time 공개 사례", url: "/resume/cases/comma-delta-time" }], remaining: 4, resetAt: "2026-11-13T00:00:00Z" } });
  });
  await page.addInitScript((theme) => localStorage.setItem("theme", theme), testInfo.project.name.endsWith("dark") ? "dark" : "light");
  await page.goto("/resume");
  const chat = page.getByRole("region", { name: "Ask Boa", exact: true }); await chat.scrollIntoViewIfNeeded();
  await chat.getByRole("textbox").fill("COMMA의 판단 근거를 설명해 주세요"); await chat.getByRole("button", { name: "질문 보내기" }).click();
  await expect(chat.getByText("Boa · AI가 작성한 답변", { exact: true })).toBeInViewport();
  await expect(chat.getByRole("link", { name: "Delta Time 공개 사례" })).toHaveAttribute("href", "/resume/cases/comma-delta-time");
  await testInfo.attach("chat-ai-success-mock", { body: await chat.screenshot({ animations: "disabled" }), contentType: "image/png" });
  await chat.getByRole("textbox").fill("동일한 공개 사례의 근거는?"); await chat.getByRole("button", { name: "질문 보내기" }).click();
  await expect(chat.getByText("Boa · AI 답변 (저장됨)", { exact: true })).toBeInViewport();
  expect(calls).toBe(2);
});

test("an async answer preserves scroll position while reading older messages", async ({ page }) => {
  let release!: () => void; const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/resume/chat", async (route) => { await pending; await route.fulfill({ json: { mode: "fallback", answer: "비동기 응답 확인", sources: [] } }); });
  await page.goto("/resume"); const chat = page.getByRole("region", { name: "Ask Boa", exact: true }); await chat.scrollIntoViewIfNeeded();
  for (let i = 0; i < 3; i++) await chat.getByRole("button", { name: /주사율에 따라/ }).click();
  await chat.getByRole("textbox").fill("COMMA의 구현 판단을 더 설명해 주세요"); await chat.getByRole("button", { name: "질문 보내기" }).click();
  await expect(chat.getByRole("status")).toBeVisible();
  const log = chat.getByRole("log"); await log.evaluate((element) => { element.scrollTop = 0; element.dispatchEvent(new Event("scroll")); });
  release(); await expect(chat.getByText("비동기 응답 확인")).toBeAttached();
  expect(await log.evaluate((element) => element.scrollTop)).toBe(0);
});
