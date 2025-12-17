import SiteFooter from "@/app/(layout)/(shell)/_components/layout/SiteFooter";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-post min-h-screen w-screen ">
      <main className="px-5 pt-20 lg:pt-22 lg:pl-65 lg:pr-40">{children}</main>
      <SiteFooter />
    </div>
  );
}
