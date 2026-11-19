import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PlaceCivicYearsClasses } from "#/modules/insights/schema/interface/place-civic-years-classes.interface.ts";

/** Place Civic Years */
export interface PlaceCivicYears {
  classes: PlaceCivicYearsClasses[];
  total: Number;
  year: Number;
}
