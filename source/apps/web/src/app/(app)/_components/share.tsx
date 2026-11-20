"use client";
import { useState } from "react";
export function SharePlace({ language }: { language: string }) {
  const [includeLanguage, setIncludeLanguage] = useState(true);
  const [message, setMessage] = useState("");
  async function copy() {
    const url = new URL(window.location.href);
    if (includeLanguage) url.searchParams.set("lang", language);
    else url.searchParams.delete("lang");
    try {
      await navigator.clipboard.writeText(url.toString());
      setMessage("Link copied.");
    } catch {
      setMessage(url.toString());
    }
  }
  return (
    <div className="real-card">
      <h2>Share this place</h2>
      <label>
        <input type="checkbox" checked={includeLanguage} onChange={(event) => setIncludeLanguage(event.target.checked)} /> Include
        language ({language})
      </label>{" "}
      <button onClick={copy}>Copy link</button>
      <p role="status">{message}</p>
    </div>
  );
}
