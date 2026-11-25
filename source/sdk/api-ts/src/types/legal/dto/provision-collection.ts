import type { LegalProvisionEntry } from "#sdk/types/legal/dto/provision-entry.ts";

/** Provision Collection */
export interface LegalProvisionCollection {
  provisions: LegalProvisionEntry[];
}
