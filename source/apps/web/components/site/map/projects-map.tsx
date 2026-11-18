"use client";

import "leaflet/dist/leaflet.css";

import type { Map as LeafletMap } from "leaflet";
import { useEffect, useRef } from "react";

const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const STATUS_COLOUR: Record<string, string> = {
  completed: "oklch(0.545 0.095 130)", ongoing: "oklch(0.43 0.085 250)", planned: "oklch(0.735 0.138 76)", stalled: "oklch(0.53 0.185 28)",
};

export interface Pin { readonly code: string; readonly name: string; readonly status: string; readonly location: GeoJSON.Point; readonly href: string }

/** Projects as coloured pins (by status) over the place's outline. Click a pin to open the project. */
export default function ProjectsMap({ pins, outline, height = 420 }: { pins: readonly Pin[]; outline?: GeoJSON.Geometry | null; height?: number }) {
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const key = pins.map((p) => p.code).join(",");
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || host.current === null) return;
      map.current?.remove();
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const instance = L.map(host.current, { zoomControl: false, scrollWheelZoom: false }).setView([0.5, 38], 6);
      map.current = instance;
      L.control.zoom({ position: "bottomright" }).addTo(instance);
      L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19, className: dark ? "tiles-dark" : "" }).addTo(instance);
      const group = L.featureGroup();
      if (outline) L.geoJSON(outline, { style: { color: "oklch(0.585 0.152 41)", weight: 2.5, fillColor: "oklch(0.585 0.152 41)", fillOpacity: 0.1 } }).addTo(group);
      for (const pin of pins) {
        const [lon, lat] = pin.location.coordinates as [number, number];
        L.circleMarker([lat, lon], { radius: 8, color: "#fff", weight: 2, fillColor: STATUS_COLOUR[pin.status] ?? "gray", fillOpacity: 0.95 })
          .bindTooltip(`<strong>${pin.name}</strong><br>${pin.status}`, { sticky: true })
          .on("click", () => { window.location.href = pin.href; })
          .addTo(group);
      }
      group.addTo(instance);
      if (group.getLayers().length > 0) instance.fitBounds(group.getBounds(), { padding: [20, 20], maxZoom: 15 });
      setTimeout(() => instance.invalidateSize(), 50);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => () => { map.current?.remove(); map.current = null; }, []);
  return <div ref={host} role="application" aria-label="Map of projects" style={{ height }} className="overflow-hidden rounded-[var(--radius)] glass" />;
}
