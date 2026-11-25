import type { Heading } from "#/modules/legal/schema/type/heading.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString } from "#/modules/shared/schema/type/non-empty-string.type.ts";

/** Provision Entry Wordings */
export interface ProvisionEntryWordings {
  editionId: Id;
  heading: Heading | null;
  languageCode: IdentityCode;
  text: NonEmptyString;
}
