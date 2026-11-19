"use client";
/** The last place, or the first-visit setup. Reads the saved place only: it never changes country, theme or context. */
import { ArrowRight, Crosshair } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { resolvePlace } from "#/data/places";
import { usePrefsInit } from "#/lib/prefs";
import { prettify, type Place } from "#/lib/route";
import { homePath, readHome } from "#/lib/saved";
import { Onboarding } from "./onboarding";

const label = (p: Place) => { const r = resolvePlace(p.country, p.trail); return r.ok ? [r.countryName, ...r.trail.map((t) => t.name)].join(" › ") : [p.country, ...p.trail].map(prettify).join(" › "); };

export function ResumeCard() {
  const router = useRouter();
  const place = usePrefsInit().place;
  const [open, setOpen] = useState(false);
  // First visit with no saved place: the setup opens by itself, once.
  useEffect(() => { if (!place && !readHome()) { try { if (!localStorage.getItem("mzizi-onboarded")) setOpen(true); } catch {} } }, [place]);
  const finish = () => { try { localStorage.setItem("mzizi-onboarded", "1"); } catch {} setOpen(false); };
  const done = (home: Place) => { finish(); router.push(homePath(home)); };

  return (
    <>
      {place?.country ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-5">
          <div className="min-w-0"><div className="font-mono text-[10px] uppercase tracking-widest text-accent">Continue where you left off</div><div className="mt-1 truncate font-display text-2xl">{label(place)}</div></div>
          <div className="flex items-center gap-2"><button onClick={() => setOpen(true)} className="rounded-md border border-line px-3 py-2 text-sm hover:bg-accent-soft">Change</button><Link href={homePath(place)} className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-paper">Continue <ArrowRight size={14} /></Link></div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-5">
          <div><div className="font-display text-xl">Set your place</div><p className="mt-1 text-sm text-muted">Pick your country and area once. Mzizi remembers it.</p></div>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-paper"><Crosshair size={15} />Set up</button>
        </div>
      )}
      <Onboarding open={open} onClose={finish} onDone={done} />
    </>
  );
}
