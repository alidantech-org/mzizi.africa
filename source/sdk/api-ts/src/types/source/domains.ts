import { SharedDatePrecision } from "#sdk/types/enums/shared/date-precision.ts";

/** A host name a source is served from. A host belongs to one source at a time; its validity period records moves. */
export interface SourceDomains {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  host: string;
  id: string;
  sourceId: string;
  startsOn?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
