"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Icon } from "#/components/brand/icon.tsx";
import { placeAt } from "#/lib/site/links.ts";
import { search, type SearchHit } from "#/lib/site/insights.ts";

/** Type a place and pick it from the list; each choice opens `/<place>/<section>`. */
export function PlacePicker({ section }: { section: string }) {
  const [text, setText] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  useEffect(() => {
    if (text.trim().length < 2) { setHits([]); return; }
    const timer = setTimeout(() => search(text.trim(), "place", 8).then((r) => setHits(r.hits), () => setHits([])), 200);
    return () => clearTimeout(timer);
  }, [text]);
  return (
    <div className="relative">
      <label className="glass flex items-center gap-2 rounded-full px-5 py-3"><Icon name="pin" size={18} className="text-clay" />
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Choose a place: a county, ward, town…" aria-label="Choose a place" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-content-muted" />
      </label>
      {hits.length > 0 ? (
        <ul className="glass-strong absolute left-0 right-0 z-20 mt-2 rounded-3xl p-2">{hits.map((h) => (
          <li key={h.id}><Link onClick={() => { setHits([]); setText(""); }} href={placeAt(h.placePath, section)} className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2 hover:bg-surface-sunken"><span className="font-semibold">{h.title}</span><span className="truncate text-xs text-content-muted">{h.path.slice(1, -1).join(" › ")} · {h.subtitle}</span></Link></li>
        ))}</ul>
      ) : null}
    </div>
  );
}
