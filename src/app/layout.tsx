import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://b0o0a.com"),
  title: {
    default: "B-log | 프론트엔드 개발 기술 블로그",
    template: "%s | B-log",
  },
  description: "프론트엔드 개발자 최보아의 기술 블로그. Next.js · React · 테스트 · 성능 최적화 · SEO · Three.js",
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
    url: "https://b0o0a.com",
    title: "B-log | 프론트엔드 개발 기술 블로그",
    description: "프론트엔드 개발자 최보아의 기술 블로그, 포트폴리오",
    images: [
      { url: "/post-fallback.png", width: 1200, height: 630, alt: "B-log" },
    ],
    locale: "ko_KR",
  },
  
  alternates: {
    canonical: "https://b0o0a.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
