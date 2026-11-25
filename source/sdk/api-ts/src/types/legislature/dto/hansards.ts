import { LegislatureHansardStatus } from "#sdk/types/legislature/enums/hansard-status.ts";

/** The official record of a sitting. */
export interface LegislatureHansards {
  artifactId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  languageId: string;
  publishedOn?: string | null;
  reference?: string | null;
  sittingId: string;
  status: LegislatureHansardStatus;
  updatedAt: string;
  version: number;
}
