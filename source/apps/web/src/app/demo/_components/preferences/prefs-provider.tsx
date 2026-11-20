"use client";
/** Hands the cookie values read on the server to every client component, and starts the browser-side store from them. */
import type { ReactNode } from "react";
import type { PrefsInit } from "#demo/_lib/preferences/pref-cookies";
import { PrefsInitContext, seedPrefs } from "#demo/_lib/preferences/prefs";

export function PrefsProvider({ init, children }: { init: PrefsInit; children: ReactNode }) {
  seedPrefs(init);
  return <PrefsInitContext.Provider value={init}>{children}</PrefsInitContext.Provider>;
}
