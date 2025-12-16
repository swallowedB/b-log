import SiteFooter from "@/app/(layout)/(shell)/_components/layout/SiteFooter";
import SiteHeader from "@/app/(layout)/(shell)/_components/layout/SiteHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
