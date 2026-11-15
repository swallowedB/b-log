import { expect, test } from "@playwright/test";

test("actual API validates requests and free questions fall back with AI disconnected", async ({ page, request }, testInfo) => {
  expect((await request.get("/api/resume/chat")).status()).toBe(405);
  expect((await request.post("/api/resume/chat", { data: { message: " " } })).status()).toBe(400);
  expect((await request.post("/api/resume/chat", { data: { message: "COMMA?", requestId: "4adc2052-9cca-4cbe-849b-85bb04613def" }, headers: { origin: "https://other.invalid" } })).status()).toBe(403);
  const result = await request.post("/api/resume/chat", { data: { message: "COMMA의 시간 기준 설계 배경은?", requestId: "4adc2052-9cca-4cbe-849b-85bb04613def" } });
  expect(result.headers()["cache-control"]).toBe("no-store");
  expect((await result.json()).mode).toBe("fallback");
  await page.addInitScript((theme) => localStorage.setItem("theme", theme), testInfo.project.name.endsWith("dark") ? "dark" : "light");
  await page.goto("/resume");
  const chat = page.getByRole("region", { name: "Ask Boa", exact: true });
  await chat.scrollIntoViewIfNeeded();
  await chat.getByRole("textbox").fill("COMMA의 시간 기준 설계 배경은?");
  await chat.getByRole("button", { name: "질문 보내기" }).click();
  await expect(chat.getByText(/지금은 자유 질문 답변/)).toBeVisible();
  await expect(chat.getByText("Boa · 안내", { exact: true })).toBeInViewport();
  await testInfo.attach("chat-api-fallback", { body: await chat.screenshot({ animations: "disabled" }), contentType: "image/png" });
});

test("mock quota response exposes pending and remaining/reset without duplicate sends", async ({ page }, testInfo) => {
  let release!: () => void;
  const ready = new Promise<void>((resolve) => { release = resolve; });
  let calls = 0;
  await page.route("**/api/resume/chat", async (route) => {
    calls++; await ready;
    await route.fulfill({ status: 429, json: { mode: "fallback", code: "quota", answer: "지금은 자유 질문 이용 한도에 도달했어요. 추천 질문과 공개 자료는 계속 볼 수 있습니다.", sources: [], remaining: 0, resetAt: "2026-11-13T00:00:00Z" } });
  });
  await page.addInitScript((theme) => localStorage.setItem("theme", theme), testInfo.project.name.endsWith("dark") ? "dark" : "light");
  await page.goto("/resume");
  const chat = page.getByRole("region", { name: "Ask Boa", exact: true });
  await chat.scrollIntoViewIfNeeded();
  await chat.getByRole("textbox").fill("Delta Time 선택 배경은?");
  await chat.getByRole("button", { name: "질문 보내기" }).click();
  await expect(chat.getByRole("status")).toHaveText(/공개 자료를 확인하고/);
  await expect(chat.getByRole("button", { name: "질문 보내기" })).toBeDisabled();
  await testInfo.attach("chat-api-pending-mock", { body: await chat.screenshot({ animations: "disabled" }), contentType: "image/png" });
  release();
  await expect(chat.getByText(/이용 한도에 도달/)).toBeVisible();
  await expect(chat.getByText(/오늘 자유 질문 0회 남음/)).toBeVisible();
  expect(calls).toBe(1);
  await testInfo.attach("chat-api-quota-mock", { body: await chat.screenshot({ animations: "disabled" }), contentType: "image/png" });
});
