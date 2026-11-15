import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AskBoaCard from "../cards/AskBoaCard";
import type { ResumeFAQ } from "@/lib/resume/types";

const faqs: ResumeFAQ[] = [{ id: "case:timing", question: "게임 속도 문제는?", aliases: ["주사율 문제"], answer: "Delta Time으로 경과 시간을 반영했습니다.", sources: [{ id: "case:timing", type: "case", title: "게임 사례", url: "/resume/cases/timing" }] }];
const previousFetch = globalThis.fetch;
beforeEach(() => { globalThis.fetch = jest.fn(); });
afterEach(() => { globalThis.fetch = previousFetch; });

it("answers repeated suggested questions with reviewed sources and no request", async () => {
  const user = userEvent.setup();
  render(<AskBoaCard faqs={faqs} />);
  await user.click(screen.getByRole("button", { name: "게임 속도 문제는?" }));
  const log = screen.getByRole("log", { name: "대화 내용" });
  expect(within(log).getByText("Delta Time으로 경과 시간을 반영했습니다.")).toBeInTheDocument();
  expect(within(log).getByRole("link", { name: "게임 사례" })).toHaveAttribute("href", "/resume/cases/timing");
  await user.click(screen.getByRole("button", { name: "게임 속도 문제는?" }));
  expect(within(log).getAllByText("Delta Time으로 경과 시간을 반영했습니다.")).toHaveLength(2);
  expect(globalThis.fetch).not.toHaveBeenCalled();
  expect(screen.queryByText(/AI가 작성한 답변/)).not.toBeInTheDocument();
});

it("rejects whitespace and overlong input without adding a conversation", () => {
  render(<AskBoaCard faqs={faqs} />);
  const input = screen.getByRole("textbox", { name: "Boa에게 질문" });
  fireEvent.change(input, { target: { value: "   " } });
  expect(screen.getByRole("button", { name: "질문 보내기" })).toBeDisabled();
  fireEvent.change(input, { target: { value: "가".repeat(301) } });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(screen.getByRole("button", { name: "질문 보내기" })).toBeDisabled();
  expect(screen.getByText(/300자 이내/)).toBeInTheDocument();
  expect(within(screen.getByRole("log")).queryAllByRole("article")).toHaveLength(0);
});

it("preserves IME composition and Shift+Enter, then submits a normal Enter", () => {
  render(<AskBoaCard faqs={faqs} />);
  const input = screen.getByRole("textbox", { name: "Boa에게 질문" });
  fireEvent.change(input, { target: { value: "주사율 문제" } });
  fireEvent.compositionStart(input);
  fireEvent.keyDown(input, { key: "Enter", isComposing: true, keyCode: 229 });
  fireEvent.compositionEnd(input);
  fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
  expect(within(screen.getByRole("log")).queryAllByRole("article")).toHaveLength(0);
  fireEvent.keyDown(input, { key: "Enter" });
  expect(within(screen.getByRole("log")).getByText("Delta Time으로 경과 시간을 반영했습니다.")).toBeInTheDocument();
  expect(input).toHaveValue("");
});

it("keeps unsupported input in static exploration mode", () => {
  render(<AskBoaCard faqs={faqs} />);
  const input = screen.getByRole("textbox", { name: "Boa에게 질문" });
  fireEvent.change(input, { target: { value: "자료에 없는 경험은?" } });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(screen.getByText(/자유 질문은 준비 중/)).toBeInTheDocument();
  expect(globalThis.fetch).not.toHaveBeenCalled();
});
