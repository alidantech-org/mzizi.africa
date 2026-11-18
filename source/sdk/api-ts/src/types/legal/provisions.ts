import { LegalProvisionKind } from "#sdk/types/enums/legal/provision-kind.ts";

/** Stable provision identity within one instrument; hierarchy stays within that instrument. One provision holds one statement. */
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
  title?: string | null;
  updatedAt: string;
  version: number;
}
