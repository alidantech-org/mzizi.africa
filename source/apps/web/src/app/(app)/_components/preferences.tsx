"use client";
import { useEffect } from "react";
import { persistLanguage } from "../_lib/actions";
export function DevicePreferences({ theme, explicitLanguage }: { theme: string; explicitLanguage?: string }) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    if (explicitLanguage) void persistLanguage(explicitLanguage).catch(() => {});
  }, [explicitLanguage]);
  return theme === "system" ? null : (
    <style>
      {theme === "dark"
        ? 'html[data-ui="real"]{--ink:#f2ecde!important;--paper:#14110d!important;--accent:#ec7a4e!important;--line:#352f25!important;color-scheme:dark}'
        : 'html[data-ui="real"]{--ink:#1d1a16!important;--paper:#f4efe5!important;--accent:#b8431f!important;--line:#e0d7c6!important;color-scheme:light}'}
    </style>
  );
}
