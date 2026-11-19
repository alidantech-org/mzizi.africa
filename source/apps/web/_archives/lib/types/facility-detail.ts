import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type FacilityRow } from "#/_archives/lib/types/facility-row";
import { type HostedStation } from "#/_archives/lib/types/hosted-station";
import { type PlaceRef } from "#/_archives/lib/types/place-ref";

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
