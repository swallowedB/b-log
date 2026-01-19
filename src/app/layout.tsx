import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://b0o0a.com"),
  title: {
    default: "B-log",
    template: "%s | B-log",
  },
  description: "FE 개발자 최보아의 프로젝트, 기술 인사이트, 개발 기록 블로그",
  icons: {
    icon: "/favicon.svg",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/post-fallback.png"],
  },
  openGraph: {
    type: "website",
    siteName: "B-log",
  },
  alternates: {
    canonical: "/",
  },
};

const pretendard = localFont({
  src: "../assets/fonts/pretendard/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "400 500 600 700 800 900",
  display: "swap",
});

const permanentMarker = localFont({
  src: "../assets/fonts/permanentMarker/PermanentMarker-Regular.woff2",
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
      <body className="min-h-screen bg-background text-foreground transition-colors flex flex-col items-center">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="theme"
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
