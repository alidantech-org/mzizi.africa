/** Server entry for the app shell: reads the preference cookies and renders sidebar, app bar and theme from them. */
import type { ReactNode } from "react";
import { readPrefs } from "#demo/_lib/server/server-prefs";
import { AppShell } from "#demo/_components/layout/app-shell";
import { PrefsProvider } from "#demo/_components/preferences/prefs-provider";

export async function Shell({ children }: { children: ReactNode }) {
  const init = await readPrefs();
  return (
    <PrefsProvider init={init}>
      <AppShell>{children}</AppShell>
    </PrefsProvider>
  );
}
