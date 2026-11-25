import * as dryv from "@dryvcode/author";

import { shared, sharedProperties } from "./_shared.ts";

/**
 * Plain periods (FOUNDATION_REDESIGN sections 22.1 and 30): integer years are the period every table reads and indexes;
 * exact dates named for the table (`establishedOn`, `endedOn`) are optional precision kept in agreement with the years by
 * Mzizi's write code. Contract authors: descriptions on the fields become SQL comments.
 */
export const periodProperties = shared.properties({
  Year: dryv.property.number.integer({ range: { min: -10000, max: 3000 } }),
  /** How precise a historical date is (history.occurrences). */
  DatePrecision: dryv.property.enum({
    Day: "day",
    Month: "month",
    Year: "year",
    Decade: "decade",
    Circa: "circa",
  }),
});

/** The only fields a period contributes. Every period base spreads exactly these. */
export const periodFields = {
  fromYear: dryv
    .field(periodProperties.Year)
    .maybe()
    .description("First year of the period (negative for BCE); empty when the start is not known."),
  toYear: dryv
    .field(periodProperties.Year)
    .maybe()
    .description("Last year of the period; empty while the period has not ended."),
};

export { sharedProperties };
