import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type FacilityRow } from "#/lib/types/facility-row.ts";
import { type HostedStation } from "#/lib/types/hosted-station.ts";
import { type PlaceRef } from "#/lib/types/place-ref.ts";

/** Facility Detail */
export interface FacilityDetail {
  chain: PlaceRef[];
  facility: FacilityRow;
  gaps: string[];
  stations: HostedStation[];
}

/** Field metadata for forms and results. */
export const FacilityDetailFields: readonly FieldMeta[] = [
  { name: "chain", label: "Chain", kind: "other", required: true },
  { name: "facility", label: "Facility", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "stations", label: "Stations", kind: "other", required: true },
];
