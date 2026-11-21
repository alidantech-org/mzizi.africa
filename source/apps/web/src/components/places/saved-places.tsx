"use client";
/** Saved places, each with a label, kept in a cookie. With `manage`, labels can be edited and places added or removed. */
import { Search, X } from "lucide-react";
import Link from "#/components/navigation/demo-link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { copy } from "@mzizi/copy";
import { TextField } from "#/components/ui/controls";
import { useCopy } from "#/lib/copy/copy";
import { demoSegments } from "#/lib/navigation/base";
import { replaceQuery } from "#/lib/navigation/replace";
import { build, type ViewId } from "#/lib/navigation/route";
import { usePlaceCatalogue } from "#/lib/places/catalogue";
import { addSaved, labelSaved, removeSaved, useSaved } from "#/lib/preferences/saved";

const SUBJECTS: ViewId[] = ["leaders", "law", "compare"];

function PlaceFinder({ onPick }: { onPick: (path: string) => void }) {
  const t = useCopy();
  const router = useRouter();
  const path = usePathname();
  const { found, searchable } = usePlaceCatalogue();
  const [q, setQ] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typed = (value: string) => {
    setQ(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(location.search);
      if (value.trim().length >= 2) params.set("find", value.trim());
      else params.delete("find");
      replaceQuery(router, `${path}${params.size ? `?${params}` : ""}`);
    }, 250);
  };
  const results = q.trim().length >= 2 && found && found.kind === null && found.query === q.trim() ? found.entries.slice(0, 8) : [];
  return (
    <div className="relative max-w-xl">
      <TextField
        label={t(copy.pages.saved.find)}
        value={q}
        onChange={typed}
        placeholder={t(copy.pages.saved.findPlaceholder)}
        icon={<Search size={16} />}
        size="lg"
      />
      {!searchable && <p className="mt-2 text-xs text-muted">{t(copy.pages.saved.findNeedsCountry)}</p>}
      {results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-lg border border-line bg-surface p-1">
          {results.map((e) => (
            <li key={e.href}>
              <button
                onClick={() => {
                  onPick(e.href);
                  typed("");
                }}
                className="flex w-full min-w-0 items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-accent-soft"
              >
                <span className="w-24 shrink-0 truncate font-mono text-[10px] uppercase tracking-wider text-accent">{e.kind}</span>
                <span className="min-w-0 truncate">{e.name}</span>
                <span className="ml-auto max-w-[40%] shrink-0 truncate text-xs text-muted">{e.where}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SavedPlaces({ manage = false }: { manage?: boolean }) {
  const t = useCopy();
  const router = useRouter();
  const saved = useSaved();
  const { navigation, countries, resolved } = usePlaceCatalogue();
  const [label, setLabel] = useState("");
  // The layout names the places saved when the page was read; a place added since is named by reading the page again, once.
  const asked = useRef("");
  useEffect(() => {
    const key = saved.map((s) => s.path).join("|");
    if (key !== asked.current && saved.some((s) => !(s.path in resolved))) {
      asked.current = key;
      router.refresh();
    }
  }, [saved, resolved, router]);
  const here = countries.find((c) => c.levelDefs.length > 0)?.code; // the country the subject availability is known for

  return (
    <div className="space-y-4">
      {manage && (
        <div className="flex flex-wrap items-start gap-3">
          <div className="w-48">
            <div className="mb-1 truncate text-xs text-muted">{t(copy.pages.saved.labelOptional)}</div>
            <TextField label={t(copy.pages.saved.label)} value={label} onChange={setLabel} placeholder={t(copy.pages.saved.labelPlaceholder)} />
          </div>
          <div className="min-w-0 flex-1 pt-5">
            <PlaceFinder
              onPick={(path) => {
                addSaved(path, label.trim());
                setLabel("");
              }}
            />
          </div>
        </div>
      )}
      {!saved.length ? (
        <p className="rounded-lg border border-dashed border-muted p-6 text-sm text-muted">
          {t(copy.pages.saved.empty)}
          {manage ? t(copy.pages.saved.emptyManage) : ""}
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((s) => {
            const [country, ...trail] = demoSegments(s.path);
            const known = resolved[s.path] ?? null;
            const name = known?.name ?? t(copy.pages.saved.unresolved);
            const place = { country: country ?? "", trail };
            return (
              <li key={s.path} className="rounded-lg border border-line bg-surface p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {s.label && (
                      <div className="mb-1 inline-block max-w-full truncate rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                        {s.label === "Home" ? t(copy.pages.saved.home) : s.label}
                      </div>
                    )}
                    <div className="truncate font-display text-xl">{name}</div>
                    {known && (
                      <div className="truncate text-xs text-muted">{[known.kind, known.parent].filter(Boolean).join(" · ")}</div>
                    )}
                  </div>
                  {manage && (
                    <button
                      onClick={() => removeSaved(s.path)}
                      aria-label={t(copy.pages.saved.remove, { place: name })}
                      className="grid size-6 shrink-0 place-items-center rounded-md text-muted hover:bg-accent-soft"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                {manage && s.label !== "Home" && (
                  <div className="mt-2">
                    <div className="mb-1 truncate text-xs text-muted">{t(copy.pages.saved.label)}</div>
                    <TextField label={t(copy.pages.saved.label)} size="sm" value={s.label} onChange={(v) => labelSaved(s.path, v)} />
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                  <Link href={s.path} className="max-w-full truncate rounded-md bg-accent px-2 py-1 text-paper">
                    {t(copy.pages.saved.explore)}
                  </Link>
                  {here === country &&
                    SUBJECTS.filter((v) => navigation[v] !== false).map((v) => (
                      <Link
                        key={v}
                        href={build(place, { view: v })}
                        className="max-w-full truncate rounded-md border border-line px-2 py-1 hover:bg-accent-soft"
                      >
                        {t(copy.shell.link[v])}
                      </Link>
                    ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
