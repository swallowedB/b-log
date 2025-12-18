import SiteFooter from "@/app/(layout)/(shell)/_components/layout/SiteFooter";
import DockMenu from "./_components/dock/DockMenu";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <DockMenu />
      <main className="flex-1 pt-16 max-w-[1560px]  w-full">{children}</main>
      <SiteFooter />
    </div>
  );
}
