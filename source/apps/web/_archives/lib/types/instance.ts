import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** The ledger of generated records: which template produced which institution, position, office, site or contact, for which unit, and whether it is still only expected or has been sourced or verified. */
export interface Instance {
  contactId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  domainId?: string | null;
  generatedAt: string;
  id: string;
  institutionId?: string | null;
  officeId?: string | null;
  positionId?: string | null;
  statusId: string;
  templateId: string;
  unitFeatureId?: string | null;
  updatedAt: string;
  verifiedCitationId?: string | null;
  version: number;
}

/** Field metadata for forms and results. */
export const InstanceFields: readonly FieldMeta[] = [
  { name: "contactId", label: "Contact Id", kind: "string", required: false },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "domainId", label: "Domain Id", kind: "string", required: false },
  { name: "generatedAt", label: "Generated At", kind: "date", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  {
    name: "institutionId",
    label: "Institution Id",
    kind: "string",
    required: false,
  },
  { name: "officeId", label: "Office Id", kind: "string", required: false },
  { name: "positionId", label: "Position Id", kind: "string", required: false },
  { name: "statusId", label: "Status Id", kind: "string", required: true },
  { name: "templateId", label: "Template Id", kind: "string", required: true },
  {
    name: "unitFeatureId",
    label: "Unit Feature Id",
    kind: "string",
    required: false,
  },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  {
    name: "verifiedCitationId",
    label: "Verified Citation Id",
    kind: "string",
    required: false,
  },
  { name: "version", label: "Version", kind: "number", required: true },
];
