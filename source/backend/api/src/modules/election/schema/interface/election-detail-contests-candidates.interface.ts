import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { ElectionDetailContestsCandidatesNames } from "#/modules/election/schema/interface/election-detail-contests-candidates-names.interface.ts";

/** Election Detail Contests Candidates */
export interface ElectionDetailContestsCandidates {
  ballotOrder: PositiveInteger | null;
  candidateId: Id;
  individualId: Id;
  names: ElectionDetailContestsCandidatesNames[];
  partyCode: IdentityCode | null;
  partyId: Id | null;
}
