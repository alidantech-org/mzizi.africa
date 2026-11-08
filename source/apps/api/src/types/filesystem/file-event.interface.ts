
import type { EventKind } from "#/types/filesystem/event-kind.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** File Event */
export interface FileEvent {
  actorId?: Id | null;
  createdAt: DateTime;
  detail?: Description | null;
  fileId: Id;
  id: Id;
  kind: EventKind;
  occurredAt: DateTime;
  updatedAt: DateTime;
  version: Version;
  versionId?: Id | null;
}