"use client";

import "leaflet/dist/leaflet.css";

import type { GeoJSON as LeafletGeoJSON, Map as LeafletMap } from "leaflet";
import { useEffect, useRef } from "react";

const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export interface Region {
  readonly featureId: string;
  readonly name: string;
  readonly geometry: GeoJSON.Geometry | null;
  /** The fill colour, already resolved by the caller. */
  readonly fill: string;
  /** A line or two shown on hover. */
  readonly tooltip: string;
}

interface Props {
  readonly regions: readonly Region[];
  readonly selectedId?: string | null;
  readonly onSelect?: (featureId: string) => void;
  readonly height?: number;
}

/** A map of regions filled by a value (a heat map): hover for the figures, click to select. Outlines are drawn over faint tiles. */
export default function Choropleth({ regions, selectedId = null, onSelect, height = 420 }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LeafletGeoJSON | null>(null);
  const handler = useRef(onSelect);
  handler.current = onSelect;
  const signature = regions.map((r) => `${r.featureId}:${r.fill}`).join("|");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || host.current === null) return;
      if (map.current === null) {
        const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        map.current = L.map(host.current, { zoomControl: false, scrollWheelZoom: false, attributionControl: true }).setView([0.5, 38], 6);
        L.control.zoom({ position: "bottomright" }).addTo(map.current);
        L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 18, opacity: 0.55, className: dark ? "tiles-dark" : "" }).addTo(map.current);
      }
      layer.current?.remove();
      const features = regions.filter((r) => r.geometry !== null).map((r) => ({ type: "Feature" as const, properties: { id: r.featureId, name: r.name, fill: r.fill, tooltip: r.tooltip }, geometry: r.geometry! }));
      if (features.length === 0) return;
      layer.current = L.geoJSON({ type: "FeatureCollection", features } as unknown as GeoJSON.GeoJsonObject, {
        pointToLayer: (feature, latlng) => L.circleMarker(latlng, { radius: 9, color: "#fff", weight: 2, fillColor: feature.properties.fill, fillOpacity: 0.95 }),
        style: (feature) => ({ color: "oklch(0.25 0.02 55 / 0.55)", weight: feature?.properties.id === selectedId ? 3 : 0.8, fillColor: feature?.properties.fill, fillOpacity: 0.82 }),
        onEachFeature: (feature, item) => {
          item.bindTooltip(`<strong>${feature.properties.name}</strong><br>${feature.properties.tooltip}`, { sticky: true });
          item.on("click", () => handler.current?.(feature.properties.id));
          item.on("mouseover", () => (item as L.Path).setStyle?.({ weight: 2.4 }));
          item.on("mouseout", () => layer.current?.resetStyle(item as L.Path));
        },
      }).addTo(map.current!);
      map.current!.fitBounds(layer.current.getBounds(), { padding: [12, 12] });
      setTimeout(() => map.current?.invalidateSize(), 50);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, selectedId]);

  useEffect(() => () => { map.current?.remove(); map.current = null; }, []);
  return <div ref={host} role="application" aria-label="Map" style={{ height }} className="overflow-hidden rounded-[var(--radius)] glass" />;
}
