import DockMenu from "./_components/dock/DockMenu";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DockMenu />
      <main className="flex-1 pt-16 max-w-[1560px]">{children}</main>
    </>
  );
}
