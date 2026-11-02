
import type { StructureFileRole } from "#/types/website/structure-file-role.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BundlePath } from "#/types/website/bundle-path.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Structure File Public */
export interface StructureFilePublic {
  createdAt: DateTime;
  fileVersionId: Id;
  id: Id;
  path: BundlePath;
  role: StructureFileRole;
  updatedAt: DateTime;
  version: Version;
  versionId: Id;
}