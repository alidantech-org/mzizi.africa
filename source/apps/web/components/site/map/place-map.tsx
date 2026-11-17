"use client";

import "leaflet/dist/leaflet.css";

import type { Map as LeafletMap } from "leaflet";
import { useEffect, useRef, useState } from "react";

import { outlineOf } from "#/lib/site/geometry.ts";

export interface MapUnit {
  readonly featureId: string;
  readonly name: string;
}

/** The units from widest to narrowest; the last one is the place and is drawn boldest. */
interface Props {
  readonly units: readonly MapUnit[];
  readonly position?: { readonly latitude: number; readonly longitude: number } | null;
  readonly height?: number;
}

const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/** An interactive map of a place: its outline and the units above it, tiles that follow the colour scheme, and a pulsing marker where the visitor is. */
export default function PlaceMap({ units, position = null, height = 340 }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");
  const key = units.map((unit) => unit.featureId).join(",");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || host.current === null) return;
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      map.current?.remove();
      const instance = L.map(host.current, {
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
      }).setView([0.5, 38], 5);
      map.current = instance;
      L.control.zoom({ position: "bottomright" }).addTo(instance);
      L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19, className: dark ? "tiles-dark" : "" }).addTo(instance);
      const outlines = await Promise.all(units.map((unit) => outlineOf(unit.featureId)));
      if (cancelled) return;
      const group = L.featureGroup();
      outlines.forEach((outline, index) => {
        if (outline === null) return;
        const last = index === units.length - 1;
        const layer = L.geoJSON(outline.geometry, {
          style: last
            ? { color: "#b4542f", weight: 3, fillColor: "#b4542f", fillOpacity: 0.28 }
            : { color: "#c68a2e", weight: 1.5, dashArray: "5 6", fill: false, opacity: 0.8 },
        }).bindTooltip(units[index]?.name ?? "", { sticky: true });
        layer.addTo(instance);
        if (last || index >= units.length - 2) group.addLayer(layer);
      });
      if (position !== null) {
        const here = L.marker([position.latitude, position.longitude], {
          icon: L.divIcon({
            className: "",
            html: '<div class="you-are-here"></div>',
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          }),
          keyboard: false,
        }).addTo(instance);
        group.addLayer(here);
      }
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        instance.flyToBounds(bounds, { padding: [28, 28], duration: 1.1, maxZoom: 15 });
        setStatus("ready");
      } else {
        setStatus("empty");
      }
    })().catch(() => setStatus("empty"));
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
    // `units` and `position` are rebuilt every render; `key` and the coordinates say when they really changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, position?.latitude, position?.longitude]);

  return (
    <div className="relative overflow-hidden rounded-[var(--radius)] border border-border-default shadow-[var(--shadow)]">
      <div ref={host} style={{ height }} role="application" aria-label="Map of this place" />
      {status === "loading" ? <div className="skeleton absolute inset-0" aria-hidden /> : null}
      {status === "empty" ? (
        <p className="absolute inset-x-0 bottom-3 mx-auto w-fit rounded-full bg-surface-elevated px-4 py-1 text-xs text-content-muted shadow">
          No outline is recorded for this place yet.
        </p>
      ) : null}
    </div>
  );
}
