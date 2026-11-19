"use client";

/** Sharing serializes existing navigation state; it does not read product data or change preferences. */
import { useState } from "react";
import type { ExplorerAddress } from "#/lib/types/explorer-address.ts";
import { explorerAt, explorerLanguages } from "#/lib/dryv/explorer-address.ts";

export function ShareExplorer({ path, state, language }: { path: string; state: ExplorerAddress; language: string }) {
  const [includeLanguage, setIncludeLanguage] = useState(true);
  const [message, setMessage] = useState("");
  const selected = explorerLanguages.find((choice) => choice.code === language)?.code;
  const share = async () => {
    const address = new URL(explorerAt(path, { ...state, lang: includeLanguage ? selected : undefined }), window.location.origin).href;
    try {
      await navigator.clipboard.writeText(address);
      setMessage("Link copied");
    } catch { setMessage(address); }
  };
  return <div className="flex flex-wrap items-center gap-3 text-sm">
    <label className="flex items-center gap-2"><input type="checkbox" checked={includeLanguage} onChange={(event) => setIncludeLanguage(event.target.checked)} />Include selected language</label>
    <button className="btn btn-ghost" type="button" onClick={share}>Copy link</button>
    <span role="status" className="max-w-lg break-all text-xs text-content-muted">{message}</span>
  </div>;
}
