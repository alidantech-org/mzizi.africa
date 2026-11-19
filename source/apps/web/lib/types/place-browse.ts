import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceBrowseMedia } from "#/lib/types/place-browse-media.ts";
import { type PlaceChild } from "#/lib/types/place-child.ts";
import { type PlaceCrumb } from "#/lib/types/place-crumb.ts";

/** Place Browse */
export interface PlaceBrowse {
  chain: PlaceCrumb[];
  children: PlaceChild[];
  media: PlaceBrowseMedia[];
  place?: PlaceCrumb | null;
}

/** Field metadata for forms and results. */
export const PlaceBrowseFields: readonly FieldMeta[] = [
  { name: "chain", label: "Chain", kind: "other", required: true },
  { name: "children", label: "Children", kind: "other", required: true },
  { name: "media", label: "Media", kind: "other", required: true },
  { name: "place", label: "Place", kind: "other", required: false },
];
