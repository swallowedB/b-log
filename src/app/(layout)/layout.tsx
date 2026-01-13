
import SiteHeader from "@/app/(layout)/(shell)/_components/layout/SiteHeader";
import { CommandPaletteProvider } from "@/components/common/CommandPalette";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CommandPaletteProvider>
      <SiteHeader />
      <div className="flex justify-center w-full">{children}</div>
    </CommandPaletteProvider>
  );
}
