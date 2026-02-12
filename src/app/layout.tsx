import "katex/dist/katex.min.css";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import ThemedAurora from "@/components/aurora-themed";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.description}`,
  description: siteConfig.description,
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body
        suppressHydrationWarning
        className={cn("min-h-screen bg-background font-sans text-foreground antialiased")}
      >
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-25 dark:opacity-50">
          <ThemedAurora />
        </div>
        <div className="root relative z-10 flex min-h-screen flex-col [--fd-layout-width:1400px]">
          <RootProvider theme={{ attribute: "class", defaultTheme: "dark", enableSystem: false }}>
            {children}
          </RootProvider>
        </div>
      </body>
    </html>
  );
}
