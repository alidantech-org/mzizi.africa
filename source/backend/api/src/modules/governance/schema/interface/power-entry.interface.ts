import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PowerEntryToNames } from "#/modules/governance/schema/interface/power-entry-to-names.interface.ts";

/** Power Entry */
export interface PowerEntry {
  isBinding: Flag;
  kindTerm: Id;
  powerId: Id;
  provisionId: Id | null;
  thresholdTerm: Id | null;
  toCode: IdentityCode;
  toId: Id;
  toNames: PowerEntryToNames[];
}
