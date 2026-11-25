import type { ProvisionKind } from "#/modules/legal/schema/enum/provision-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { ProvisionEntryWordings } from "#/modules/legal/schema/interface/provision-entry-wordings.interface.ts";

/** Provision Entry */
export interface ProvisionEntry {
  code: IdentityCode;
  designation: NonEmptyString255;
  kind: ProvisionKind;
  parentId: Id | null;
  position: PositiveInteger;
  provisionId: Id;
  wordings: ProvisionEntryWordings[];
}
