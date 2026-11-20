/** Server entry for the app shell: reads the preference cookies and renders sidebar, app bar and theme from them. */
import type { ReactNode } from "react";
import { readPrefs } from "#/lib/server/server-prefs";
import { loadPlaceCatalogue } from "#/lib/server/places";
import { PlaceCatalogueProvider } from "#/lib/places/catalogue";
import { AppShell } from "#/components/layout/app-shell";
import { PrefsProvider } from "#/components/preferences/prefs-provider";

export async function Shell({ children }: { children: ReactNode }) {
  const init = await readPrefs();
  const catalogue = await loadPlaceCatalogue(init.place?.country);
  return (
    <PrefsProvider init={init}>
      <PlaceCatalogueProvider value={catalogue}>
        <AppShell>{children}</AppShell>
      </PlaceCatalogueProvider>
    </PrefsProvider>
  );
}
