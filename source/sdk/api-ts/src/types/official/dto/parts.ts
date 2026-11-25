import { OfficialNamePart } from "#sdk/types/official/enums/name-part.ts";
import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** The parts of a person's name (given, family), for sorting and formal display. */
export interface OfficialParts {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  nameId: string;
  nameKind: SharedIdentityKind;
  part: OfficialNamePart;
  position: number;
  text: string;
}
