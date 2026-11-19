import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Project Detail Project */
export interface ProjectDetailProject {
  code: string;
  completedOn?: string | null;
  description: string;
  location: unknown;
  name: string;
  responsible?: string | null;
  startedOn: string;
  status: string;
  unit: string;
  unitId: string;
  unitPath: string;
}

/** Field metadata for forms and results. */
export const ProjectDetailProjectFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "completedOn", label: "Completed On", kind: "string", required: false },
  { name: "description", label: "Description", kind: "string", required: true },
  { name: "location", label: "Location", kind: "other", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "responsible", label: "Responsible", kind: "string", required: false },
  { name: "startedOn", label: "Started On", kind: "string", required: true },
  { name: "status", label: "Status", kind: "string", required: true },
  { name: "unit", label: "Unit", kind: "string", required: true },
  { name: "unitId", label: "Unit Id", kind: "string", required: true },
  { name: "unitPath", label: "Unit Path", kind: "string", required: true },
];
