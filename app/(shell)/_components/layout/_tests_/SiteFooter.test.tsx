import { render, screen } from "@testing-library/react";
import SiteFooter from "../SiteFooter";

describe("SiteFooter 테스트", () => {
  test("카피라이트 텍스트가 렌더링된다", () => {
    render(<SiteFooter />);

    expect(screen.getByText(/CHOI BOA/i)).toBeInTheDocument();
  });

  test("Github 링크가 렌더링된다", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: /깃허브로 이동/i })).toBeInTheDocument();
  })
})