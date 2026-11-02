
import type { VersionStatus } from "#/types/website/version-status.enum.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { SchemaVersion } from "#/types/website/schema-version.type.ts";
import type { Structure } from "#/types/website/structure.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Structure Version Public */
export interface StructureVersionPublic {
  createdAt: DateTime;
  createdBy?: Id | null;
  folderId?: Id | null;
  id: Id;
  manifestHash: Checksum;
  methodId?: Id | null;
  notesSummary?: Description | null;
  number: Version;
  schemaVersion: SchemaVersion;
  status: VersionStatus;
  structureId: Id;
  supersedesId?: Id | null;
  updatedAt: DateTime;
  validationReport?: LongText | null;
  version: Version;
}