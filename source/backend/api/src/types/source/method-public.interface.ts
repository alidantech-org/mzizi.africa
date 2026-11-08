
import type { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { ToolName } from "#/types/source/tool-name.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Method Public */
export interface MethodPublic {
  createdAt: DateTime;
  description?: Description | null;
  id: Id;
  kind: ProvenanceMethod;
  model?: ToolName | null;
  name: Name;
  tool?: ToolName | null;
  toolVersion?: ToolName | null;
  updatedAt: DateTime;
  version: Version;
}