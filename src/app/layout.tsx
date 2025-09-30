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
  description: "한양대학교 커뮤니케이션디자인학과 2025년도 졸업전시 웹사이트",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/logo.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pinyonScript.variable} ${nunitoSans.variable} antialiased overflow-x-hidden`}
      >
        <ProtectedLayout>{children}</ProtectedLayout>
      </body>
    </html>
  );
}
