import "./globals.css";
import localFont from "next/font/local"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "B-log",
  description: "boa's dev blog",
};

const pretendard = localFont({
  src: "../public/fonts/pretendard/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "400 500 600 700 800 900",
  display: "swap",
})

const permanentMarker = localFont({
  src: "../public/fonts/permanentMarker/PermanentMarker-Regular.woff2",
  variable: "--font-permanent",
  display: 'swap'
}) 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="ko"
      className={`${pretendard.variable} ${permanentMarker.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
