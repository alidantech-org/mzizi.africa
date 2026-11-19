import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type InstitutionListArmsGroupsInstitutions } from "#/lib/types/institution-list-arms-groups-institutions.ts";
import { type InstitutionListArmsGroupsKind } from "#/lib/types/institution-list-arms-groups-kind.ts";

/** Institution List Arms Groups */
export interface InstitutionListArmsGroups {
  institutions: InstitutionListArmsGroupsInstitutions[];
  kind: InstitutionListArmsGroupsKind;
}

/** Field metadata for forms and results. */
export const InstitutionListArmsGroupsFields: readonly FieldMeta[] = [
  { name: "institutions", label: "Institutions", kind: "other", required: true },
  { name: "kind", label: "Kind", kind: "other", required: true },
];
