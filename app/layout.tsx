import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "B-log",
  description: "boa's dev blog",
  icons: {
    icon: "/favicon.svg",
  },
};

const pretendard = localFont({
  src: "../public/fonts/pretendard/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "400 500 600 700 800 900",
  display: "swap",
});

const permanentMarker = localFont({
  src: "../public/fonts/permanentMarker/PermanentMarker-Regular.woff2",
  variable: "--font-permanent",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${pretendard.variable} ${permanentMarker.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
