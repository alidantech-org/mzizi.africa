
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Citation } from "#/types/source/citation.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { Publisher } from "#/types/source/publisher.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Document */
export interface Document {
  citation?: Citation | null;
  createdAt: DateTime;
  id: Id;
  jurisdictionId?: Id | null;
  kindId: Id;
  language?: Label | null;
  licence?: Name | null;
  publishedOn?: Date | null;
  publishedOnPrecision?: DatePrecision | null;
  publisherId: Id;
  title: Name;
  updatedAt: DateTime;
  url?: Url | null;
  version: Version;
}