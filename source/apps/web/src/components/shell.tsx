/** Server entry for the app shell: reads the preference cookies and renders sidebar, app bar and theme from them. */
import type { ReactNode } from "react";
import { readPrefs } from "#/lib/server-prefs";
import { AppShell } from "./nav";
import { PrefsProvider } from "./prefs-provider";

export async function Shell({ children }: { children: ReactNode }) {
  const init = await readPrefs();
  return <PrefsProvider init={init}><AppShell>{children}</AppShell></PrefsProvider>;
}
