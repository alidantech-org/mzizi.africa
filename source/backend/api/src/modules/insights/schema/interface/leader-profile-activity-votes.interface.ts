import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/** Leader Profile Activity Votes */
export interface LeaderProfileActivityVotes {
  absent: Number;
  abstain: Number;
  attendance?: Number | null;
  no: Number;
  total: Number;
  yes: Number;
}
