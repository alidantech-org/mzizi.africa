/**
 * The divisions of a place drawn on the server as SVG from prepared outlines (FOUNDATION_REDESIGN section 20): no map
 * library, no client fetch. Each division links to its own page.
 */
import Link from "next/link";
import { hrefOf } from "#/lib/server/codes";
import { loadMap } from "#/lib/server/views/place-home";

import type { Position } from "#/lib/server/parse/geojson";

export default async function PlaceMap({ parentId, label }: { parentId: string; label: string }) {
  const shapes = await loadMap(parentId, 1);
  const drawn = (shapes ?? []).map((s) => ({ code: s.code, rings: s.area.rings }));
  if (drawn.length === 0) return <p className="text-sm text-muted">No outlines are loaded for the divisions of this place.</p>;
  const points = drawn.flatMap((d) => d.rings.flat());
  const xs = points.map((p) => p[0] ?? 0);
  const ys = points.map((p) => p[1] ?? 0);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;
  const path = (r: Position[][]) =>
    r.map((ring) => `M${ring.map((p) => `${((p[0] ?? 0) - minX).toFixed(4)},${(maxY - (p[1] ?? 0)).toFixed(4)}`).join("L")}Z`).join("");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className="h-80 w-full" preserveAspectRatio="xMidYMid meet">
      {drawn.map((d) => (
        <Link key={d.code} href={hrefOf(d.code)}>
          <path d={path(d.rings)} className="fill-accent/15 stroke-accent hover:fill-accent/35" strokeWidth={1} vectorEffect="non-scaling-stroke">
            <title>{d.code.split(".").at(-1)}</title>
          </path>
        </Link>
      ))}
    </svg>
  );
}
