"use client";

/** The leaders as a family tree: the country at the top, then county, constituency and ward; each level split by how the seat was won. */
import Link from "next/link";

import { Icon } from "#/components/brand/icon.tsx";
import { AsyncView } from "#/components/site/async-view.tsx";
import { Avatar } from "#/components/site/ui/media.tsx";
import { Gaps } from "#/components/site/ui/primitives.tsx";
import { Hint } from "#/components/site/ui/hint.tsx";
import { treeOf, type TreeLeader, type TreeLevel } from "#/lib/site/insights.ts";
import { useAsync } from "#/lib/site/use-async.ts";

const HOW: Record<string, { label: string; hint: string; tone: string }> = {
  elected: { label: "Elected", hint: "Chosen by voters at an election.", tone: "var(--raffia)" },
  appointed: { label: "Appointed", hint: "Chosen by the president, a governor or a commission, not by voters.", tone: "var(--indigo)" },
  nominated: { label: "Nominated", hint: "Put forward by a party to fill a reserved seat, in proportion to its votes.", tone: "var(--calabash)" },
};

function Person({ l }: { l: TreeLeader }) {
  return (
    <Link href={`/leaders/${l.holderId}`} className="glass card-lift flex items-center gap-3 rounded-2xl p-3">
      <Avatar src={l.photo} name={l.name} size={44} />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{l.name}</span>
        <span className="block truncate text-xs text-content-muted">{l.office}{l.party ? ` · ${l.party}` : ""}</span>
      </span>
    </Link>
  );
}

function Level({ level, last }: { level: TreeLevel; last: boolean }) {
  const kinds = Object.entries(level.groups).filter(([, list]) => list.length > 0);
  return (
    <li className="relative pl-10">
      <span aria-hidden className="absolute left-3 top-0 h-full w-px bg-[var(--border-default)]" style={last ? { height: "1.5rem" } : undefined} />
      <span aria-hidden className="absolute left-3 top-6 h-px w-6 bg-[var(--border-default)]" />
      <span aria-hidden className="absolute left-0 top-3.5 grid h-6 w-6 place-items-center rounded-full bg-clay text-cream"><Icon name="tree" size={14} /></span>
      <div className="glass card mb-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-xl">{level.unit?.name ?? "Kenya"} <span className="text-sm font-normal text-content-muted">· {level.label}</span></h3>
          <span className="text-xs text-content-muted">{level.total} leader{level.total === 1 ? "" : "s"}</span>
        </div>
        {kinds.length === 0 ? <p className="mt-2 text-sm text-content-muted">No leader is recorded at this level.</p> : null}
        {kinds.map(([how, list]) => (
          <div key={how} className="mt-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: HOW[how]?.tone }}>
              {HOW[how]?.label ?? how} <Hint>{HOW[how]?.hint ?? ""}</Hint>
            </p>
            <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{list.slice(0, 12).map((l) => <li key={l.holderId}><Person l={l} /></li>)}</ul>
            {list.length > 12 ? <p className="mt-1 text-xs text-content-muted">and {list.length - 12} more</p> : null}
          </div>
        ))}
      </div>
    </li>
  );
}

export function LeaderTree({ featureId }: { featureId?: string }) {
  const loaded = useAsync(() => treeOf(featureId), `tree-${featureId ?? "country"}`);
  return (
    <AsyncView loaded={loaded}>
      {(d) => (
        <>
          <ol className="mt-2">{d.levels.map((l, i) => <Level key={`${l.level}-${i}`} level={l} last={i === d.levels.length - 1} />)}</ol>
          <Gaps items={d.gaps} topic="leaders" />
        </>
      )}
    </AsyncView>
  );
}
