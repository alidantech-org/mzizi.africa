import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/** Ranking Request */
export interface RankingRequest {
  country: IdentityCode;
  indicator: IdentityCode;
  lang?: IdentityCode;
  year?: Year;
}
