
import type { VariantKind } from "#/types/filesystem/variant-kind.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { StoredObject } from "#/types/filesystem/stored-object.interface.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** File Variant */
export interface FileVariant {
  createdAt: DateTime;
  derivedObjectId: Id;
  id: Id;
  kind: VariantKind;
  objectId: Id;
  parameters?: Description | null;
  updatedAt: DateTime;
  version: Version;
}