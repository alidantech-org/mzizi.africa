import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type Listing } from "#/lib/types/listing.ts";

/** Job Detail */
export interface JobDetail {
  events: unknown[];
  job: unknown;
  output: Listing | null;
}

/** Field metadata for forms and results. */
export const JobDetailFields: readonly FieldMeta[] = [
  { name: "events", label: "Events", kind: "other", required: true },
  { name: "job", label: "Job", kind: "other", required: true },
  { name: "output", label: "Output", kind: "other", required: false },
];
