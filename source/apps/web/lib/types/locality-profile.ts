import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type LocalityUnit } from "#/lib/types/locality-unit.ts";
import { type MediaRef } from "#/lib/types/media-ref.ts";
import { type OfficeHolder } from "#/lib/types/office-holder.ts";
import { type ProcurementSummary } from "#/lib/types/procurement-summary.ts";

/** Locality Profile */
export interface LocalityProfile {
  chain: LocalityUnit[];
  gaps: string[];
  languageRequested?: string | null;
  languageServed: string;
  media: MediaRef[];
  officials: OfficeHolder[];
  place: LocalityUnit;
  procurement: ProcurementSummary;
}

/** Field metadata for forms and results. */
export const LocalityProfileFields: readonly FieldMeta[] = [
  { name: "chain", label: "Chain", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "languageRequested", label: "Language Requested", kind: "string", required: false },
  { name: "languageServed", label: "Language Served", kind: "string", required: true },
  { name: "media", label: "Media", kind: "other", required: true },
  { name: "officials", label: "Officials", kind: "other", required: true },
  { name: "place", label: "Place", kind: "other", required: true },
  { name: "procurement", label: "Procurement", kind: "other", required: true },
];
