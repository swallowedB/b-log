
import SiteHeader from "@/app/(layout)/(shell)/_components/layout/SiteHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="flex justify-center">{children}</div>
    </>
  );
}
