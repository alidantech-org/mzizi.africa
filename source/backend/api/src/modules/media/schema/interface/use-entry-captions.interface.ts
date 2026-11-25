import type { Title } from "#/modules/media/schema/type/title.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";

/** Use Entry Captions */
export interface UseEntryCaptions {
  altText: NonEmptyString1000 | null;
  languageCode: IdentityCode;
  title: Title | null;
}
