/** Root layout. Scaffolded by Dryv once; this file belongs to the app: the shell (header, footer, language) is hand-built. */
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "#/app/globals.css";
import { SiteFooter } from "#/components/site/site-footer.tsx";
import { SiteHeader } from "#/components/site/site-header.tsx";
import { LanguageProvider } from "#/lib/site/i18n.tsx";
import { SavedProvider } from "#/lib/site/saved.tsx";

export const metadata: Metadata = {
  title: "Mzizi",
  description: "Who serves you, where the money goes, and the evidence behind it.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <SavedProvider>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </SavedProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
