import SiteFooter from "@/app/(layout)/(shell)/_components/layout/SiteFooter";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-post min-h-screen ">
      <main className="mt-22 ml-80 mr-55">{children}</main>
      <SiteFooter />
    </div>
  );
}
