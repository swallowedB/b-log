export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 -mt-5 pt-16 px-70 max-w-[1560px] w-full">
      {children}
    </main>
  );
}
