"use client";

import Link from "next/link";

import { Icon } from "#/components/brand/icon.tsx";
import { Pill } from "#/components/site/ui/primitives.tsx";
import { statusTone } from "#/components/site/ui/status.ts";
import { words } from "#/lib/site/format.ts";
import { Money } from "#/lib/site/country.tsx";
import type { CivicProject } from "#/lib/site/insights.ts";

export function ProjectCard({ p }: { p: CivicProject }) {
  return (
    <Link href={`/projects/${p.code}`} className="glass card-lift group block overflow-hidden rounded-[var(--radius)]">
      <div className="relative aspect-[16/9] bg-surface-sunken">
        {p.media ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.media.url} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center opacity-30"><Icon name="build" size={44} /></div>}
        <span className="absolute left-3 top-3"><Pill tone={statusTone(p.status)}>{words(p.status)}</Pill></span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-display text-lg leading-snug">{p.name}</h3>
        <p className="mt-1 text-xs text-content-muted">{p.unit}{p.started_on ? ` · ${p.started_on.slice(0, 4)}` : ""}{p.contractor ? ` · ${p.contractor}` : ""}</p>
        {p.amount !== null ? <p className="num mt-2 text-sm font-semibold"><Money value={p.amount} /></p> : null}
      </div>
    </Link>
  );
}
