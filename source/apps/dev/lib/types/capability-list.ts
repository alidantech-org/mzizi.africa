import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type Capability } from "#/lib/types/capability.ts";

/** Capability List */
export interface CapabilityList {
  capabilities: Capability[];
}

/** Field metadata for forms and results. */
export const CapabilityListFields: readonly FieldMeta[] = [
  { name: "capabilities", label: "Capabilities", kind: "other", required: true },
];
