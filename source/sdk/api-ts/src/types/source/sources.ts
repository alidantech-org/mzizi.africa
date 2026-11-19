import { SourceSourceKind } from "#sdk/types/enums/source/source-kind.ts";

/** A publication channel: a real website or a real API, with its classification and credibility. */
export interface SourceSources {
  classificationId?: string | null;
  code: string;
  createdAt: string;
  credentialBinding?: string | null;
  credibilityId?: string | null;
  deletedAt?: string | null;
  description?: string | null;
  id: string;
  kind: SourceSourceKind;
  licenceId?: string | null;
  officialEntityId?: string | null;
  publisherId: string;
  termsUrl?: string | null;
  title: string;
  updatedAt: string;
  version: number;
}
