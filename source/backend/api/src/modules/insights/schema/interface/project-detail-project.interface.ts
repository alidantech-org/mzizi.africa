import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Project Detail Project */
export interface ProjectDetailProject {
  code: String;
  completedOn?: String | null;
  description: String;
  location: unknown;
  name: String;
  responsible?: String | null;
  startedOn: String;
  status: String;
  unit: String;
  unitId: String;
  unitPath: String;
}
