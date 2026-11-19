"use client";
/** Hands the cookie values read on the server to every client component, and starts the browser-side store from them. */
import type { ReactNode } from "react";
import type { PrefsInit } from "#/lib/pref-cookies";
import { PrefsInitContext, seedPrefs } from "#/lib/prefs";

export function PrefsProvider({ init, children }: { init: PrefsInit; children: ReactNode }) {
  seedPrefs(init);
  return <PrefsInitContext.Provider value={init}>{children}</PrefsInitContext.Provider>;
}
