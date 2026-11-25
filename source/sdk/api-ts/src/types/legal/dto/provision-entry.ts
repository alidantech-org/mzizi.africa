import { LegalProvisionKind } from "#sdk/types/legal/enums/provision-kind.ts";
import type { LegalProvisionEntryWordings } from "#sdk/types/legal/dto/provision-entry-wordings.ts";

/** Provision Entry */
export interface LegalProvisionEntry {
  code: string;
  designation: string;
  kind: LegalProvisionKind;
  parentId: string | null;
  position: number;
  provisionId: string;
  wordings: LegalProvisionEntryWordings[];
}
