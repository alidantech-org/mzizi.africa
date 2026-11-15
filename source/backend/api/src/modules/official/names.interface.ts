
import type { Flag } from "#/modules/shared/flag.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { LanguageTag } from "#/modules/shared/language-tag.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** One attested name form for exactly one entity or individual, with optional language and validity. */
export interface Names {
  createdAt: Instant;
  deletedAt?: Instant | null;
  entityId?: Id | null;
  id: Id;
  individualId?: Id | null;
  isPreferred: Flag;
  languageTag?: LanguageTag | null;
  name: Name;
  nameKindId: Id;
  sourceCitationId?: Id | null;
  updatedAt: Instant;
  validFrom?: CalendarDate | null;
  validUntil?: CalendarDate | null;
  version: PositiveInteger;
}