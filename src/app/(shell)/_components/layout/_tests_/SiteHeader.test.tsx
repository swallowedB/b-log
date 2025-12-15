import { render, screen } from "@testing-library/react";
import SiteHeader from "../SiteHeader";

jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    resolvedTheme: "light",
    setTheme: jest.fn(),
  })
}))

describe("SiteHeader", () => {
  test("로고가 렌더링된다", () => {
    render(<SiteHeader />);

    const logos = screen.getAllByAltText(/b-log/i);
    expect(logos.length).toBeGreaterThan(0);
  });

  test("주요 네비게이션 메뉴가 렌더링된다", () => {
    render(<SiteHeader />);

    const resumeLinks = screen.getAllByRole("link", { name: "Resume" });
    const guestbookLinks = screen.getAllByRole("link", { name: "Guestbook" });
    const labLinks = screen.getAllByRole("link", { name: "Lab" });

    expect(resumeLinks.length).toBeGreaterThan(0);
    expect(guestbookLinks.length).toBeGreaterThan(0);
    expect(labLinks.length).toBeGreaterThan(0);
  });

  test("테마 토글 버튼이 렌더링된다", () => {
    render(<SiteHeader />);

    expect(
      screen.getByRole("button", { name: /테마 변경/i })
    ).toBeInTheDocument();
  });
});
