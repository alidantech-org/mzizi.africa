"use client";
/** Flat SVG map drawn from the backend's own boundaries. Choosing a place switches to it and keeps the subject. */
import { useState } from "react";
import { copy } from "@mzizi/copy";
import { useCopy } from "#/lib/copy/copy";
import { placeFromHref, useNav } from "#/lib/navigation/use-ctx";
import type { MapCanvas } from "#/lib/maps/project";

export function ShapeMap({
  map,
  fills,
  titles,
  selected,
  label,
  className = "",
}: {
  map: MapCanvas;
  /** A fill (a CSS colour) for each shape, by address. */
  fills: Record<string, string>;
  /** Text shown beside the name on hover or focus, by address (a value and its unit). */
  titles?: Record<string, string>;
  selected?: string;
  /** Names the group for assistive technology, for example the places inside this one. */
  label: string;
  className?: string;
}) {
  const t = useCopy();
  const nav = useNav();
  const [hover, setHover] = useState<string | null>(null);
  const act = (address: string) => nav.goPlace(placeFromHref(address));
  const current = hover ? map.shapes.find((s) => s.address === hover) : null;
  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${map.width} ${map.height}`} role="group" aria-label={label} className="mx-auto block max-h-[60svh] w-full sm:max-h-[600px]">
        {map.shapes.map((s) => (
          <path
            key={s.address}
            d={s.d}
            className="region"
            role="button"
            tabIndex={0}
            aria-label={titles?.[s.address] ? t(copy.place.map.shape, { name: s.name, value: titles[s.address]! }) : s.name}
            fill={fills[s.address] ?? "var(--line)"}
            stroke={selected === s.address ? "var(--ink)" : "var(--surface)"}
            strokeWidth={selected === s.address ? 2.6 : 1.1}
            strokeLinejoin="round"
            onClick={() => act(s.address)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && act(s.address)}
            onMouseEnter={() => setHover(s.address)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(s.address)}
            onBlur={() => setHover(null)}
          />
        ))}
      </svg>
      {current && (
        <div className="pointer-events-none absolute left-1 top-1 max-w-[90%] truncate rounded-md bg-ink px-2 py-1 sm:left-2 sm:top-2 sm:px-3 sm:py-1.5 text-xs text-paper">
          <b>{current.name}</b>
          {titles?.[current.address] && <span className="ml-2 opacity-70">{titles[current.address]}</span>}
        </div>
      )}
    </div>
  );
}
