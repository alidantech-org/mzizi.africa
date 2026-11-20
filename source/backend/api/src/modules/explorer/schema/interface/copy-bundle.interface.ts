import type { CopyHash } from "#/modules/explorer/schema/type/copy-hash.type.ts";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { CopyEntry } from "#/modules/explorer/schema/interface/copy-entry.interface.ts";

/** Copy Bundle */
export interface CopyBundle {
  entries: CopyEntry[];
  hash: CopyHash;
  language: LanguageCode;
  missing: NonEmptyString255[];
}
