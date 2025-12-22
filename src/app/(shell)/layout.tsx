import DockMenu from "@/app/(layout)/(shell)/_components/dock/DockMenu";
import SiteFooter from "@/app/(layout)/(shell)/_components/layout/SiteFooter";
import SiteHeader from "@/app/(layout)/(shell)/_components/layout/SiteHeader";


export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <DockMenu />
      <main className="flex-1 pt-16 max-w-[1560px]">{children}</main>
      <SiteFooter />
    </>
  );
}
