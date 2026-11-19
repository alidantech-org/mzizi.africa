import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type InstitutionListArmsGroupsInstitutionsArm } from "#/_archives/lib/types/institution-list-arms-groups-institutions-arm";
import { type InstitutionListArmsGroupsInstitutionsBasis } from "#/_archives/lib/types/institution-list-arms-groups-institutions-basis";
import { type InstitutionListArmsGroupsInstitutionsKind } from "#/_archives/lib/types/institution-list-arms-groups-institutions-kind";
import { type InstitutionListArmsGroupsInstitutionsParent } from "#/_archives/lib/types/institution-list-arms-groups-institutions-parent";

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
export const InstitutionListArmsGroupsInstitutionsFields: readonly FieldMeta[] =
  [
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
