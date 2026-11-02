
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { JsonText } from "#/types/website/json-text.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Dns Snapshot */
export interface DnsSnapshot {
  createdAt: DateTime;
  domainId?: Id | null;
  id: Id;
  observedAt: DateTime;
  rcode?: LongText | null;
  recordType: LongText;
  resolver?: LongText | null;
  updatedAt: DateTime;
  values: JsonText;
  version: Version;
  zoneId?: Id | null;
}