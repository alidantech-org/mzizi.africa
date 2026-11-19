import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type InstitutionListArmsGroupsInstitutionsArm } from "#/lib/types/institution-list-arms-groups-institutions-arm.ts";
import { type InstitutionListArmsGroupsInstitutionsBasis } from "#/lib/types/institution-list-arms-groups-institutions-basis.ts";
import { type InstitutionListArmsGroupsInstitutionsKind } from "#/lib/types/institution-list-arms-groups-institutions-kind.ts";
import { type InstitutionListArmsGroupsInstitutionsParent } from "#/lib/types/institution-list-arms-groups-institutions-parent.ts";

/** Institution List Arms Groups Institutions */
export interface InstitutionListArmsGroupsInstitutions {
  arm: InstitutionListArmsGroupsInstitutionsArm;
  basis: InstitutionListArmsGroupsInstitutionsBasis;
  children: number;
  code: string;
  image?: string | null;
  kind: InstitutionListArmsGroupsInstitutionsKind;
  leaders: number;
  name: string;
  parent?: InstitutionListArmsGroupsInstitutionsParent | null;
  purpose: string;
}

/** Field metadata for forms and results. */
export const InstitutionListArmsGroupsInstitutionsFields: readonly FieldMeta[] = [
  { name: "arm", label: "Arm", kind: "other", required: true },
  { name: "basis", label: "Basis", kind: "other", required: true },
  { name: "children", label: "Children", kind: "number", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "image", label: "Image", kind: "string", required: false },
  { name: "kind", label: "Kind", kind: "other", required: true },
  { name: "leaders", label: "Leaders", kind: "number", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "parent", label: "Parent", kind: "other", required: false },
  { name: "purpose", label: "Purpose", kind: "string", required: true },
];
