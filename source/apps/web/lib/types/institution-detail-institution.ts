import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type InstitutionDetailInstitutionArm } from "#/lib/types/institution-detail-institution-arm.ts";
import { type InstitutionDetailInstitutionBasis } from "#/lib/types/institution-detail-institution-basis.ts";
import { type InstitutionDetailInstitutionKind } from "#/lib/types/institution-detail-institution-kind.ts";
import { type InstitutionDetailInstitutionParent } from "#/lib/types/institution-detail-institution-parent.ts";

/** Institution Detail Institution */
export interface InstitutionDetailInstitution {
  arm: InstitutionDetailInstitutionArm;
  basis: InstitutionDetailInstitutionBasis;
  children: number;
  code: string;
  established?: string | null;
  functions: string[];
  image?: string | null;
  kind: InstitutionDetailInstitutionKind;
  leaders: number;
  name: string;
  parent?: InstitutionDetailInstitutionParent | null;
  purpose: string;
}

/** Field metadata for forms and results. */
export const InstitutionDetailInstitutionFields: readonly FieldMeta[] = [
  { name: "arm", label: "Arm", kind: "other", required: true },
  { name: "basis", label: "Basis", kind: "other", required: true },
  { name: "children", label: "Children", kind: "number", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "established", label: "Established", kind: "string", required: false },
  { name: "functions", label: "Functions", kind: "string", required: true },
  { name: "image", label: "Image", kind: "string", required: false },
  { name: "kind", label: "Kind", kind: "other", required: true },
  { name: "leaders", label: "Leaders", kind: "number", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "parent", label: "Parent", kind: "other", required: false },
  { name: "purpose", label: "Purpose", kind: "string", required: true },
];
