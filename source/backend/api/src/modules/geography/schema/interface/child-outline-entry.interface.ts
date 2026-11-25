import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { ChildOutlineEntryOutlines } from "#/modules/geography/schema/interface/child-outline-entry-outlines.interface.ts";

/** Child Outline Entry */
export interface ChildOutlineEntry {
  code: IdentityCode;
  featureId: Id;
  outlines: ChildOutlineEntryOutlines[];
}
