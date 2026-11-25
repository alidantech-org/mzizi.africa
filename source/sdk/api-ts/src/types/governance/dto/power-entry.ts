import type { GovernancePowerEntryToNames } from "#sdk/types/governance/dto/power-entry-to-names.ts";

/** Power Entry */
export interface GovernancePowerEntry {
  isBinding: boolean;
  kindTerm: string;
  powerId: string;
  provisionId: string | null;
  thresholdTerm: string | null;
  toCode: string;
  toId: string;
  toNames: GovernancePowerEntryToNames[];
}
