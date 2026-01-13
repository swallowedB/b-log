import SiteFooter from "@/app/(layout)/(shell)/_components/layout/SiteFooter";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-post min-h-screen w-screen ">
      <main className="px-5 pt-20 lg:px-20 xl:pt-22 xl:pl-54 xl:pr-30">{children}</main>
      <SiteFooter />
    </div>
  );
}
