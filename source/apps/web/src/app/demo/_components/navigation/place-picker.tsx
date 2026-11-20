"use client";
/** Choose which places to compare. Options are all at the same level. Selection lives in the URL (view.places). */
import { Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { useNav } from "#demo/_lib/navigation/use-ctx";
import { TextField } from "#demo/_components/ui/controls";

export type PickOption = { code: string; name: string; hint?: string };

export function PlacePicker({
  options,
  selected,
  colors,
  noun,
}: {
  options: PickOption[];
  selected: string[];
  colors: string[];
  noun: string;
}) {
  const nav = useNav();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const set = (list: string[]) => nav.set({ "view.places": list.join(",") || null });
  const left = options.filter((o) => !selected.includes(o.code) && o.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="relative flex flex-wrap items-center gap-2">
      {selected.map((s, i) => {
        const o = options.find((x) => x.code === s);
        return (
          o && (
            <span
              key={s}
              className="inline-flex items-center gap-2 rounded-md border border-line bg-surface py-1.5 pl-3 pr-2 text-sm"
            >
              <span className="size-2.5 rounded-full" style={{ background: colors[i] }} />
              {o.name}
              <button
                aria-label={`Remove ${o.name}`}
                onClick={() => set(selected.filter((x) => x !== s))}
                className="grid size-5 place-items-center rounded hover:bg-line"
              >
                <X size={12} />
              </button>
            </span>
          )
        );
      })}
      {selected.length < 5 && (
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-muted px-3 py-1.5 text-sm text-muted hover:text-ink"
        >
          <Plus size={14} />
          Add a {noun}
        </button>
      )}
      {open && (
        <div className="floating absolute left-0 top-full z-20 mt-2 w-72 rounded-lg border border-line bg-surface p-2">
          <TextField
            label={`Search ${noun}s`}
            value={q}
            onChange={setQ}
            placeholder={`Search ${noun}s`}
            icon={<Search size={15} />}
            autoFocus
            size="sm"
            className="mb-1"
          />
          <ul className="max-h-60 overflow-y-auto">
            {left.map((o) => (
              <li key={o.code}>
                <button
                  onClick={() => {
                    set([...selected, o.code]);
                    setOpen(false);
                    setQ("");
                  }}
                  className="flex w-full justify-between gap-2 rounded-md px-3 py-1.5 text-left text-sm hover:bg-accent-soft"
                >
                  <span>{o.name}</span>
                  <span className="truncate text-xs text-muted">{o.hint}</span>
                </button>
              </li>
            ))}
            {!left.length && <li className="px-3 py-3 text-sm text-muted">Nothing to add.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
