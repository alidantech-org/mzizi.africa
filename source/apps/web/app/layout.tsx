/** Root layout. Scaffolded by Dryv once; this file belongs to the app: the shell (header, footer, language) is hand-built. */
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";

import "#/app/globals.css";
import { MobileNav } from "#/components/site/mobile-nav.tsx";
import { SiteFooter } from "#/components/site/site-footer.tsx";
import { SiteHeader } from "#/components/site/site-header.tsx";
import { THEME_INIT } from "#/components/site/theme-toggle.tsx";
import { LanguageProvider } from "#/lib/site/i18n.tsx";
import { SavedProvider } from "#/lib/site/saved.tsx";

const display = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["opsz"] });
const body = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Mzizi",
  description: "Who serves you, where the money goes, and the evidence behind it.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_INIT }} /></head>
      <body className={`${display.variable} ${body.variable}`}>
        <LanguageProvider>
          <SavedProvider>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <MobileNav />
          </SavedProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
