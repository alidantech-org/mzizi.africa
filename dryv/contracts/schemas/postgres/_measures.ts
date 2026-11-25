/**
 * Enums shared by figure-like rows in statistics, election and economy (FOUNDATION_REDESIGN sections 29 and 30.7).
 * Contract authors: this is a leaf file (it imports no schema), so any schema can use these values at load time.
 */
import * as dryv from "@dryvcode/author";
import { shared } from "#/schemas/_shared.ts";

export const measureProperties = shared.properties({
  FigureStatus: dryv.property.enum({
    Final: "final",
    Provisional: "provisional",
    Revised: "revised",
    Estimated: "estimated",
    Projected: "projected",
    Suppressed: "suppressed",
    Missing: "missing",
  }),
  FigureBasis: dryv.property.enum({
    Measured: "measured",
    Estimated: "estimated",
    Projected: "projected",
    Modelled: "modelled",
    Aggregated: "aggregated",
  }),
  /** Fingerprint of the sorted breakdown term codes of a figure; empty string is the total. */
  Cell: dryv.property.string().length({ max: 1000 }),
});
