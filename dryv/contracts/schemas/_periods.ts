import * as dryv from "@dryvcode/author";

import { shared, sharedProperties } from "./_shared.ts";

/**
 * Plain periods. A table that has a period says what it means in its own words; there is no general validity window.
 *
 * - `fromYear` and `toYear` are integer years (negative for BCE), always queryable and indexable. An empty `toYear` means the
 *   period has not ended.
 * - `fromToPrecision` says how certain the two years are, in one column for the pair.
 * - A table where the day matters adds exact dates named for the table (`establishedOn`, `joinedOn`). When an exact date is
 *   present the matching year is always filled and the precision is `exact`.
 */
export const periodProperties = shared.properties({
  Year: dryv.property.number.integer({ range: { min: -10000, max: 3000 } }),
  /** How certain the period's years are: both ends together. */
  DatePrecision: dryv.property.enum({
    Exact: "exact",
    Approximate: "approximate",
    StartApproximate: "start-approximate",
    EndApproximate: "end-approximate",
    Unknown: "unknown",
  }),
});

/** The only fields a period contributes. Every period base spreads exactly these. */
export const periodFields = {
  fromYear: dryv.field(periodProperties.Year).maybe(),
  toYear: dryv.field(periodProperties.Year).maybe(),
  fromToPrecision: dryv.field(periodProperties.DatePrecision).maybe(),
};

export { sharedProperties };
