import SiteFooter from "@/app/(layout)/(shell)/_components/layout/SiteFooter";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-post min-h-screen w-screen ">
      <main className="px-5 pt-20 lg:pt-22 lg:pl-54 lg:pr-30">{children}</main>
      <SiteFooter />
    </div>
  );
}
