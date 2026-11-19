import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/** Place Elections Turnout Trend */
export interface PlaceElectionsTurnoutTrend {
  registered: Number;
  turnout: Number;
  year: Number;
}
