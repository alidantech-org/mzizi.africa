import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type InstitutionListArmsGroupsInstitutions } from "#/_archives/lib/types/institution-list-arms-groups-institutions";
import { type InstitutionListArmsGroupsKind } from "#/_archives/lib/types/institution-list-arms-groups-kind";

/** Institution List Arms Groups */
export interface InstitutionListArmsGroups {
  institutions: InstitutionListArmsGroupsInstitutions[];
  kind: InstitutionListArmsGroupsKind;
}

/** Field metadata for forms and results. */
export const InstitutionListArmsGroupsFields: readonly FieldMeta[] = [
  {
    name: "institutions",
    label: "Institutions",
    kind: "other",
    required: true,
  },
  { name: "kind", label: "Kind", kind: "other", required: true },
];
