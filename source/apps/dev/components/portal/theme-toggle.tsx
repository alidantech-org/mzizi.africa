"use client";

import { useEffect, useState } from "react";

import { Icon } from "#/components/brand/icon.tsx";

type Choice = "system" | "light" | "dark";
const KEY = "mzizi.theme";

/** The inline script that sets the theme before the page paints, so there is no flash. */
export const THEME_INIT = `try{var t=localStorage.getItem("${KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

function apply(choice: Choice): void {
  const root = document.documentElement;
  if (choice === "system") delete root.dataset.theme;
  else root.dataset.theme = choice;
  try {
    if (choice === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, choice);
  } catch {
    /* the choice only lasts for this visit */
  }
}

/** Light, dark or follow the device. Shows the mode you will get on the next press. */
export function ThemeToggle() {
  const [choice, setChoice] = useState<Choice>("system");
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = (() => { try { return localStorage.getItem(KEY); } catch { return null; } })();
    setChoice(stored === "light" || stored === "dark" ? stored : "system");
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setDark(document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : query.matches);
    sync();
    query.addEventListener("change", sync);
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { query.removeEventListener("change", sync); observer.disconnect(); };
  }, []);
  const next: Choice = choice === "system" ? (dark ? "light" : "dark") : choice === "dark" ? "light" : "system";
  const label = next === "system" ? "Use the device's colours" : next === "dark" ? "Switch to dark mode" : "Switch to light mode";
  return (
    <button type="button" className="btn btn-ghost !h-10 !w-10 !justify-center !p-0" aria-label={label} title={label} onClick={() => { apply(next); setChoice(next); }}>
      <Icon name={dark ? "sun" : "moon"} />
      {choice === "system" ? <span className="sr-only">(following the device)</span> : null}
    </button>
  );
}
