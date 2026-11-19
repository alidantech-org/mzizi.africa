/** Root layout. Scaffolded by Dryv once; this file belongs to the app: the shell (header, footer, language) is hand-built. */
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";

import "#/app/globals.css";
import { AppFrame } from "#/components/shell/app-frame.tsx";
import { THEME_INIT } from "#/components/site/theme-toggle.tsx";
import { LanguageProvider } from "#/lib/site/i18n.tsx";
import { headers } from "next/headers";
import { CountryProvider } from "#/lib/site/country.tsx";
import { SavedProvider } from "#/lib/site/saved.tsx";
import { loadContext, loadCopy, serverLanguage } from "#/lib/server/data.ts";

const display = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["opsz"] });
const body = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

/** Every page names its canonical address and its language alternates, so search engines index one address per page. */
export async function generateMetadata(): Promise<Metadata> {
  const path = (await headers()).get("x-path") ?? "/";
  return {
    title: "Mzizi",
    description: "Who serves you, where the money goes, and the evidence behind it.",
    metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3300"),
    alternates: { canonical: path, languages: { en: `${path}?lang=en`, sw: `${path}?lang=sw` } },
  };
}

const context_language = (value: string): "en" | "sw" => (value === "sw" ? "sw" : "en");

export default async function RootLayout({ children }: { children: ReactNode }) {
  const language = context_language(await serverLanguage());
  const context = await loadContext();
  const copy = await loadCopy(language, context?.country.code);
  const shell = {
    countryName: context?.country.name ?? "Mzizi",
    countryIso: context?.country.isoCode ?? null,
    place: context?.place ?? null,
    chain: (context?.chain ?? []).map((unit) => ({ name: unit.name, path: unit.path })),
    rest: context?.rest ?? [],
  };
  return (
    <html lang={context?.languageCode ?? "en"} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_INIT }} /></head>
      <body className={`${display.variable} ${body.variable}`}>
        <LanguageProvider initialLanguage={language} copy={copy}>
          <CountryProvider country={{ name: shell.countryName, currencyCode: context?.country.currencyCode ?? null }}>
            <SavedProvider>
              <AppFrame context={shell}>{children}</AppFrame>
            </SavedProvider>
          </CountryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
