/** Root layout. Scaffolded by Dryv once; this file belongs to the app: the shell (header, footer, language) is hand-built. */
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";

import "#/app/globals.css";
import { AppFrame } from "#/components/shell/app-frame.tsx";
import { THEME_INIT } from "#/components/site/theme-toggle.tsx";
import { LanguageProvider } from "#/lib/site/i18n.tsx";
import { SavedProvider } from "#/lib/site/saved.tsx";
import { loadContext, loadCopy, serverLanguage } from "#/lib/server/data.ts";

const display = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["opsz"] });
const body = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Mzizi",
  description: "Who serves you, where the money goes, and the evidence behind it.",
};

const context_language = (value: string): "en" | "sw" => (value === "sw" ? "sw" : "en");

export default async function RootLayout({ children }: { children: ReactNode }) {
  const language = context_language(await serverLanguage());
  const context = await loadContext();
  const copy = await loadCopy(language, context?.country.code);
  const shell = {
    countryName: context?.country.name ?? "Mzizi",
    place: context?.place ?? null,
    chain: (context?.chain ?? []).map((unit) => ({ name: unit.name, path: unit.path })),
    rest: context?.rest ?? [],
  };
  return (
    <html lang={context?.languageCode ?? "en"} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_INIT }} /></head>
      <body className={`${display.variable} ${body.variable}`}>
        <LanguageProvider initialLanguage={language} copy={copy}>
          <SavedProvider>
            <AppFrame context={shell}>{children}</AppFrame>
          </SavedProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
