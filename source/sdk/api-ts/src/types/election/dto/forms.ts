import { ElectionFormStatus } from "#sdk/types/election/enums/form-status.ts";

/** An original results document, so a reader can open the form behind any result. */
export interface ElectionForms {
  assetId: string;
  contestId: string;
  createdAt: string;
  deletedAt?: string | null;
  featureId?: string | null;
  formTerm: string;
  id: string;
  publishedOn?: string | null;
  stationId?: string | null;
  status: ElectionFormStatus;
  updatedAt: string;
  version: number;
}
