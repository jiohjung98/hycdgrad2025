import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Pinyon_Script,
  Nunito_Sans,
} from "next/font/google";
import "./globals.css";
import ProtectedLayout from "./components/ProtectedLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon-script",
  weight: "400",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "hycdgrad2025",
  description: "2025년도 한양대학교 ERICA 디자인대학 커뮤니케이션디자인학과 졸업전시회",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#164e63" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pinyonScript.variable} ${nunitoSans.variable} antialiased overflow-x-hidden`}
      >
        <ProtectedLayout>{children}</ProtectedLayout>
      </body>
    </html>
  );
}
