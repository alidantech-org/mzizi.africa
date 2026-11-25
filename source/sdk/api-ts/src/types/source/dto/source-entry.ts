import { SourceSourceKind } from "#sdk/types/source/enums/source-kind.ts";
import type { SourceSourceEntryPublisherNames } from "#sdk/types/source/dto/source-entry-publisher-names.ts";

/** Source Entry */
export interface SourceSourceEntry {
  code: string;
  credibilityTerm: string | null;
  kind: SourceSourceKind;
  label: string;
  publisherCode: string;
  publisherId: string;
  publisherNames: SourceSourceEntryPublisherNames[];
  sourceId: string;
}
