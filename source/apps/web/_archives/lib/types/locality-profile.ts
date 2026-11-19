import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type LocalityUnit } from "#/_archives/lib/types/locality-unit";
import { type MediaRef } from "#/_archives/lib/types/media-ref";
import { type OfficeHolder } from "#/_archives/lib/types/office-holder";
import { type ProcurementSummary } from "#/_archives/lib/types/procurement-summary";

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
  {
    name: "languageRequested",
    label: "Language Requested",
    kind: "string",
    required: false,
  },
  {
    name: "languageServed",
    label: "Language Served",
    kind: "string",
    required: true,
  },
  { name: "media", label: "Media", kind: "other", required: true },
  { name: "officials", label: "Officials", kind: "other", required: true },
  { name: "place", label: "Place", kind: "other", required: true },
  { name: "procurement", label: "Procurement", kind: "other", required: true },
];
