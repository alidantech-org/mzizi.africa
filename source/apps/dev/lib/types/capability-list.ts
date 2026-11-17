import type { FieldMeta } from "../dryv/transport.ts";
import { type Capability } from "./capability.ts";

/** Capability List */
export interface CapabilityList {
  capabilities: Capability[];
}

/** Field metadata for forms and results. */
export const CapabilityListFields: readonly FieldMeta[] = [
  {
    name: "capabilities",
    label: "Capabilities",
    kind: "other",
    required: true,
  },
];
