import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/data/site";
import { BottomCTABar } from "@/components/sections/BottomCTABar";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Inter_Tight({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: "%s · LvlUp" },
  description: siteConfig.description,
  openGraph: { title: siteConfig.title, description: siteConfig.description, type: "website", locale: "en_IN" },
};

export const viewport: Viewport = { themeColor: "#0e0f12", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-white px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {children}
        <BottomCTABar />
      </body>
    </html>
  );
}
