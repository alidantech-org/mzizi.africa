
import type { InstitutionPublic } from "#/types/governance/institution-public.interface.ts";
import type { OfficeHolderPublic } from "#/types/governance/office-holder-public.interface.ts";
import type { OfficePublic } from "#/types/governance/office-public.interface.ts";

/** Geography Governance Response */
export interface GeographyGovernanceResponse {
  holders: OfficeHolderPublic[];
  institutions: InstitutionPublic[];
  offices: OfficePublic[];
}