import type { SourceKind } from "#/modules/source/schema/enum/source-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Label } from "#/modules/source/schema/type/label.type.ts";
import type { SourceEntryPublisherNames } from "#/modules/source/schema/interface/source-entry-publisher-names.interface.ts";

/** Source Entry */
export interface SourceEntry {
  code: IdentityCode;
  credibilityTerm: Id | null;
  kind: SourceKind;
  label: Label;
  publisherCode: IdentityCode;
  publisherId: Id;
  publisherNames: SourceEntryPublisherNames[];
  sourceId: Id;
}
