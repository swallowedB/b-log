import { render, screen } from "@testing-library/react";
import DockMenu from "../DockMenu";

describe("DockMenu", () => {
  beforeEach(() => {
    render(<DockMenu />);
  });
  test("독메뉴 네비게이션이 렌더링된다", () => {
    expect(
      screen.getByRole("navigation", { name: /Dock menu/i })
    ).toBeInTheDocument();
  });

  test("모든 메뉴 아이템이 aria-label 기준으로 렌더링된다", () => {
    const labels = ["DEV_LOG", "INSIGHT", "JOURNAL", "CONTACT", "PHOTOBOOTH"];

    labels.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  test("CONTACT 아이콘은 mailto 링크를 가진다", () => {
    const contact = screen.getByLabelText("CONTACT");
    expect(contact.closest("a")).toHaveAttribute(
      "href",
      "mailto:musamea99@gmail.com"
    );
  });

  test("초기 상태는 expanded로 모든 메뉴 아이템이 렌더링된다", () => {
    const labels = ["DEV_LOG", "INSIGHT", "JOURNAL", "CONTACT", "PHOTOBOOTH"];

    labels.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });
});
