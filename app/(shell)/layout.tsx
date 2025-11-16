import DockMenu from "./_components/dock/DockMenu";
import SiteFooter from "./_components/layout/SiteFooter";
import SiteHeader from "./_components/layout/SiteHeader";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <DockMenu />
      <main className="flex-1 pt-16">{children}</main>
      <SiteFooter />
    </>
  );
}
