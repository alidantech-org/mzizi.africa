"use client";
/** Keeps `<html lang>` equal to the language the server rendered the page in. The root layout cannot read the request (it is prerendered), so the first paint script and this component set it. */
import { useEffect } from "react";
import { useLanguage } from "#/lib/copy/copy";

export function LangSync() {
  const language = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return null;
}
