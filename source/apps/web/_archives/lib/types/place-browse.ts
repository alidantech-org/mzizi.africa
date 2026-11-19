import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type PlaceBrowseMedia } from "#/_archives/lib/types/place-browse-media";
import { type PlaceChild } from "#/_archives/lib/types/place-child";
import { type PlaceCrumb } from "#/_archives/lib/types/place-crumb";

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
