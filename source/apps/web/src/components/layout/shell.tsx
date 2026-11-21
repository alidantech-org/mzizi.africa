/** Server entry for the app shell: reads the preference cookies and renders sidebar, app bar and theme from them. */
import type { ReactNode } from "react";
import { readPrefs } from "#/lib/server/server-prefs";
import { loadCopy } from "#/lib/server/copy";
import { CopyProvider } from "#/lib/copy/copy";
import { LangSync } from "#/lib/copy/lang-sync";
import { loadPlaceCatalogue } from "#/lib/server/places";
import { PlaceCatalogueProvider } from "#/lib/places/catalogue";
import { AppShell } from "#/components/layout/app-shell";
import { PrefsProvider } from "#/components/preferences/prefs-provider";

/** Saved places and the home place, as addresses, so the backend can name them in the reader's language. */
const savedAddresses = (init: Awaited<ReturnType<typeof readPrefs>>): string[] => [
  ...new Set([...(init.home ? [`/${[init.home.country, ...init.home.trail].join("/")}`] : []), ...init.saved.map((s) => s.path)]),
];

export async function Shell({ children }: { children: ReactNode }) {
  const init = await readPrefs();
  const [catalogue, bundle] = await Promise.all([loadPlaceCatalogue(init.place?.country, savedAddresses(init)), loadCopy(init.place?.country)]);
  return (
    <PrefsProvider init={init}>
      <CopyProvider bundle={bundle}>
        <LangSync />
        <PlaceCatalogueProvider value={catalogue}>
          <AppShell>{children}</AppShell>
        </PlaceCatalogueProvider>
      </CopyProvider>
    </PrefsProvider>
  );
}
