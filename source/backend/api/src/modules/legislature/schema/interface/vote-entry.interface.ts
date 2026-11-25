import type { VoteChoice } from "#/modules/legislature/schema/enum/vote-choice.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Vote Entry */
export interface VoteEntry {
  choice: VoteChoice;
  holderId: Id;
  individualId: Id;
  partyCode: IdentityCode | null;
  partyId: Id | null;
}
