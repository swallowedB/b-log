import { render, screen } from "@testing-library/react";
import DockMenu from "./DockMenu";

describe("DockMenu", () => {
  test("독메뉴 네비게이션이 렌더링된다", () => {
    render(<DockMenu />);
    expect(
      screen.getByRole("navigation", { name: /Dock menu/i })
    ).toBeInTheDocument();
  });

  test("모든 메뉴 아이템이 aria-label 기준으로 렌더링된다", () => {
    render(<DockMenu />);
    const labels = ["DEV_LOG", "INSIGHT", "JOURNAL", "CONTACT", "PHOTOBOOTH"];

    labels.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });
});
