"use client";
/**
 * A small slippy map from OpenStreetMap tiles. Drag to move, +/- to zoom, click to drop a pin. Tiles are loaded from
 * tile.openstreetmap.org only while this map is on screen; nothing else is sent. Map data © OpenStreetMap contributors.
 */
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TILE = 256;
const worldX = (lon: number, z: number) => ((lon + 180) / 360) * 2 ** z * TILE;
const worldY = (lat: number, z: number) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z * TILE;
};
const lonOf = (x: number, z: number) => (x / (2 ** z * TILE)) * 360 - 180;
const latOf = (y: number, z: number) => {
  const n = Math.PI - (2 * Math.PI * y) / (2 ** z * TILE);
  return (180 / Math.PI) * Math.atan(Math.sinh(n));
};

type View = { lat: number; lon: number; z: number };

export function OsmMap({
  home,
  pin,
  onPick,
  className = "",
}: {
  home: View;
  pin: { lat: number; lon: number } | null;
  onPick: (lat: number, lon: number) => void;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [view, setView] = useState<View>(home);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);
  useEffect(() => setView(home), [home.lat, home.lon, home.z]);

  const cx = worldX(view.lon, view.z),
    cy = worldY(view.lat, view.z);
  const x0 = cx - size.w / 2,
    y0 = cy - size.h / 2;
  const n = 2 ** view.z;
  const tiles: { key: string; src: string; left: number; top: number }[] = [];
  if (size.w)
    for (let ty = Math.floor(y0 / TILE); ty <= Math.floor((y0 + size.h) / TILE); ty++)
      for (let tx = Math.floor(x0 / TILE); tx <= Math.floor((x0 + size.w) / TILE); tx++) {
        if (ty < 0 || ty >= n) continue;
        const wx = ((tx % n) + n) % n;
        tiles.push({
          key: `${view.z}/${tx}/${ty}`,
          src: `https://tile.openstreetmap.org/${view.z}/${wx}/${ty}.png`,
          left: tx * TILE - x0,
          top: ty * TILE - y0,
        });
      }
  const at = (e: { clientX: number; clientY: number }) => {
    const r = box.current!.getBoundingClientRect();
    return { lat: latOf(y0 + e.clientY - r.top, view.z), lon: lonOf(x0 + e.clientX - r.left, view.z) };
  };
  const zoom = (d: number) => setView((v) => ({ ...v, z: Math.max(3, Math.min(17, v.z + d)) }));
  const pinAt = pin ? { x: worldX(pin.lon, view.z) - x0, y: worldY(pin.lat, view.z) - y0 } : null;

  return (
    <div
      ref={box}
      role="application"
      aria-label="Map. Click to choose your location."
      className={`relative touch-none select-none overflow-hidden rounded-md border border-line bg-line/40 ${className}`}
      style={{ cursor: "crosshair" }}
      onPointerDown={(e) => {
        if ((e.target as Element).closest("button")) return;
        (e.currentTarget as Element).setPointerCapture(e.pointerId);
        drag.current = { x: e.clientX, y: e.clientY, moved: false };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x,
          dy = e.clientY - d.y;
        if (!d.moved && Math.hypot(dx, dy) < 4) return;
        d.moved = true;
        d.x = e.clientX;
        d.y = e.clientY;
        setView((v) => ({
          ...v,
          lon: lonOf(worldX(v.lon, v.z) - dx, v.z),
          lat: Math.max(-80, Math.min(80, latOf(worldY(v.lat, v.z) - dy, v.z))),
        }));
      }}
      onPointerUp={(e) => {
        const d = drag.current;
        drag.current = null;
        if (d && !d.moved) {
          const p = at(e);
          onPick(p.lat, p.lon);
        }
      }}
    >
      {tiles.map((t) => (
        <img
          key={t.key}
          src={t.src}
          alt=""
          width={TILE}
          height={TILE}
          draggable={false}
          className="osm-tile pointer-events-none absolute max-w-none"
          style={{ left: t.left, top: t.top }}
        />
      ))}
      {pinAt && (
        <svg
          width="26"
          height="34"
          viewBox="0 0 26 34"
          className="pointer-events-none absolute text-accent drop-shadow"
          style={{ left: pinAt.x - 13, top: pinAt.y - 32 }}
          aria-hidden
        >
          <path
            d="M13 33C13 33 2 20.5 2 12.5a11 11 0 0 1 22 0C24 20.5 13 33 13 33Z"
            fill="currentColor"
            stroke="#fff"
            strokeWidth="2"
          />
          <circle cx="13" cy="12.5" r="4" fill="#fff" />
        </svg>
      )}
      <div className="absolute right-1.5 top-1.5 flex flex-col overflow-hidden rounded-md border border-line bg-surface">
        <button
          type="button"
          onClick={() => zoom(1)}
          aria-label="Zoom in"
          className="grid size-7 place-items-center hover:bg-accent-soft"
        >
          <Plus size={14} />
        </button>
        <button
          type="button"
          onClick={() => zoom(-1)}
          aria-label="Zoom out"
          className="grid size-7 place-items-center border-t border-line hover:bg-accent-soft"
        >
          <Minus size={14} />
        </button>
      </div>
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-0 right-0 rounded-tl bg-surface/85 px-1.5 py-0.5 text-[10px] text-muted hover:text-ink"
      >
        © OpenStreetMap contributors
      </a>
    </div>
  );
}
