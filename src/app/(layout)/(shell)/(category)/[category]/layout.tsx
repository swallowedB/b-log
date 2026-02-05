export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 -mt-5 pt-16 px-5 md:px-20 lg:px-40 xl:px-70 xl2:px-80  max-w-[1560px] w-full">
      {children}
    </main>
  );
}
