import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { TemplateProduct } from "#/lib/types/template-product.enum.ts";

/** One thing a pattern produces, how many (one per unit of a level), how it is named and coded, and the attributes it carries. Templates generate structure only, never people. */
export interface Template {
  armId?: string | null;
  classId?: string | null;
  code: string;
  codeTemplate: string;
  createdAt: string;
  deletedAt?: string | null;
  fanOutLevelId?: string | null;
  id: string;
  institutionKindId?: string | null;
  nameTemplate: string;
  parentTemplateId?: string | null;
  patternId: string;
  produces: TemplateProduct;
  roleId?: string | null;
  seatBasisId?: string | null;
  seatCount?: number | null;
  selectionMethodId?: string | null;
  sourceCitationId?: string | null;
  termLimit?: number | null;
  termYears?: number | null;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const TemplateFields: readonly FieldMeta[] = [
  { name: "armId", label: "Arm Id", kind: "string", required: false },
  { name: "classId", label: "Class Id", kind: "string", required: false },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "codeTemplate", label: "Code Template", kind: "string", required: true },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "fanOutLevelId", label: "Fan Out Level Id", kind: "string", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "institutionKindId", label: "Institution Kind Id", kind: "string", required: false },
  { name: "nameTemplate", label: "Name Template", kind: "string", required: true },
  { name: "parentTemplateId", label: "Parent Template Id", kind: "string", required: false },
  { name: "patternId", label: "Pattern Id", kind: "string", required: true },
  {
    name: "produces",
    label: "Produces",
    kind: "enum",
    required: true,
    options: Object.values(TemplateProduct),
  },
  { name: "roleId", label: "Role Id", kind: "string", required: false },
  { name: "seatBasisId", label: "Seat Basis Id", kind: "string", required: false },
  { name: "seatCount", label: "Seat Count", kind: "number", required: false },
  { name: "selectionMethodId", label: "Selection Method Id", kind: "string", required: false },
  { name: "sourceCitationId", label: "Source Citation Id", kind: "string", required: false },
  { name: "termLimit", label: "Term Limit", kind: "number", required: false },
  { name: "termYears", label: "Term Years", kind: "number", required: false },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
