import type { Count } from "#/modules/ledger/schema/type/count.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Budget */
export interface Budget {
  code: String;
  entity?: String | null;
  fiscalFrom?: String | null;
  fiscalTo?: String | null;
  kind: String;
  latestReleasedOn?: String | null;
  revisions: Count;
}
