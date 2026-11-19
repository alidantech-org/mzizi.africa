import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type Capacity } from "#/_archives/lib/types/capacity";

/** Facility Row */
export interface FacilityRow {
  capacity: Capacity[];
  classCode: string;
  classLabel: string;
  code: string;
  domainCode: string;
  domainLabel: string;
  featureId: string;
  latitude?: number | null;
  longitude?: number | null;
  name: string;
  operator?: string | null;
  ownershipLabel?: string | null;
  placeName?: string | null;
  placePath?: string | null;
  statusLabel: string;
}

/** Field metadata for forms and results. */
export const FacilityRowFields: readonly FieldMeta[] = [
  { name: "capacity", label: "Capacity", kind: "other", required: true },
  { name: "classCode", label: "Class Code", kind: "string", required: true },
  { name: "classLabel", label: "Class Label", kind: "string", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "domainCode", label: "Domain Code", kind: "string", required: true },
  {
    name: "domainLabel",
    label: "Domain Label",
    kind: "string",
    required: true,
  },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "latitude", label: "Latitude", kind: "number", required: false },
  { name: "longitude", label: "Longitude", kind: "number", required: false },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "operator", label: "Operator", kind: "string", required: false },
  {
    name: "ownershipLabel",
    label: "Ownership Label",
    kind: "string",
    required: false,
  },
  { name: "placeName", label: "Place Name", kind: "string", required: false },
  { name: "placePath", label: "Place Path", kind: "string", required: false },
  {
    name: "statusLabel",
    label: "Status Label",
    kind: "string",
    required: true,
  },
];
