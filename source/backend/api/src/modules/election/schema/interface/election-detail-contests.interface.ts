import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { ElectionDetailContestsCandidates } from "#/modules/election/schema/interface/election-detail-contests-candidates.interface.ts";

/** Election Detail Contests */
export interface ElectionDetailContests {
  candidates: ElectionDetailContestsCandidates[];
  code: IdentityCode;
  contestId: Id;
  featureId: Id | null;
  kindTerm: Id;
  officeId: Id | null;
}
