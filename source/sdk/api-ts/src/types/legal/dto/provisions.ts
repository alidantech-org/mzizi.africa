import { LegalProvisionKind } from "#sdk/types/legal/enums/provision-kind.ts";

/** The tree of articles and sections of an instrument; headings are on `wordings`. */
export interface LegalProvisions {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  designation: string;
  id: string;
  instrumentId: string;
  kind: LegalProvisionKind;
  parentId?: string | null;
  position: number;
  updatedAt: string;
  version: number;
}
