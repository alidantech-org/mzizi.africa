
import type { Id } from "#/modules/shared/id.type.ts";
import type { LanguageTag } from "#/modules/shared/language-tag.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** An official, local, alternative, translated or historical name for a feature, with optional language, validity and provenance reference. */
export interface Names {
  createdAt: Instant;
  deletedAt?: Instant | null;
  featureId: Id;
  id: Id;
  languageTag?: LanguageTag | null;
  name: Name;
  nameKindId: Id;
  sourceRefId?: Id | null;
  updatedAt: Instant;
  validFrom?: CalendarDate | null;
  validUntil?: CalendarDate | null;
  version: PositiveInteger;
}