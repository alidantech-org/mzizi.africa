"use client";
/** Flat SVG map drawn from our own shapes. Click switches the place and keeps the subject. */
import { useState } from "react";
import { countyShapes, otherCountry } from "#demo/_data/places";
import { useNav } from "#demo/_lib/navigation/use-ctx";

type Shape = { slug: string; name: string; d: string };

/** `country` decides which shapes are drawn: Kenya's counties or another country's regions. */
export function GeoMap({
  country = "ke",
  fills,
  titles,
  selected,
  className = "",
}: {
  country?: string;
  fills: Record<string, string>;
  titles?: Record<string, string>;
  selected?: string;
  className?: string;
}) {
  const nav = useNav();
  const [hover, setHover] = useState<string | null>(null);
  const oc = country === "ke" ? null : otherCountry(country);
  const width = oc?.width ?? countyShapes.width;
  const height = oc?.height ?? countyShapes.height;
  const outline = oc ? null : countyShapes.country;
  const shapes: Shape[] = oc
    ? oc.regions
    : countyShapes.shapes.map((s) => ({ slug: s.code.replace(/^ke\./, ""), name: s.name, d: s.d }));
  const act = (slug: string) => nav.goPlace({ country, trail: [slug] });
  const current = hover ? shapes.find((s) => s.slug === hover) : null;
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="group"
        aria-label={`Regions of ${oc?.name ?? "Kenya"}`}
        className="mx-auto block max-h-[600px] w-full"
      >
        {outline && (
          <path d={outline} fill="none" stroke="var(--ink)" strokeOpacity={0.18} strokeWidth={6} strokeLinejoin="round" />
        )}
        {shapes.map((s) => (
          <path
            key={s.slug}
            d={s.d}
            className="region"
            role="button"
            tabIndex={0}
            aria-label={`${s.name}${titles?.[s.slug] ? `, ${titles[s.slug]}` : ""}`}
            fill={fills[s.slug]}
            stroke={selected === s.slug ? "var(--ink)" : "var(--surface)"}
            strokeWidth={selected === s.slug ? 2.6 : 1.1}
            strokeLinejoin="round"
            onClick={() => act(s.slug)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && act(s.slug)}
            onMouseEnter={() => setHover(s.slug)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(s.slug)}
            onBlur={() => setHover(null)}
          />
        ))}
      </svg>
      {current && (
        <div className="pointer-events-none absolute left-2 top-2 rounded-md bg-ink px-3 py-1.5 text-xs text-paper">
          <b>{current.name}</b>
          {titles?.[current.slug] && <span className="ml-2 opacity-70">{titles[current.slug]}</span>}
        </div>
      )}
    </div>
  );
}
