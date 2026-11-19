import type { Count } from "#/modules/ledger/schema/type/count.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Fund */
export interface Fund {
  code: String;
  featureId?: Id | null;
  flows: Count;
  kind: String;
  manager?: String | null;
  path?: String | null;
  place?: String | null;
  source?: String | null;
}
