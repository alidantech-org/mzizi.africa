import { SourceSourceKind } from "#sdk/types/source/enums/source-kind.ts";

/** A publication channel of a publisher. */
export interface SourceSources {
  classTerm?: string | null;
  code: string;
  createdAt: string;
  credentialBinding?: string | null;
  credibilityTerm?: string | null;
  deletedAt?: string | null;
  id: string;
  kind: SourceSourceKind;
  label: string;
  licenceTerm?: string | null;
  publisherId: string;
  termsUrl?: string | null;
  updatedAt: string;
  version: number;
}
