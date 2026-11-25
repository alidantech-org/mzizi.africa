import type { GeographyChildOutlineEntryOutlines } from "#sdk/types/geography/dto/child-outline-entry-outlines.ts";

/** Child Outline Entry */
export interface GeographyChildOutlineEntry {
  code: string;
  featureId: string;
  outlines: GeographyChildOutlineEntryOutlines[];
}
