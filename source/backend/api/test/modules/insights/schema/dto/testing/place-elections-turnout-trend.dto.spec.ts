import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceElectionsTurnoutTrendDto } from "#/modules/insights/schema/dto/place-elections-turnout-trend.dto.ts";
import { placeElectionsTurnoutTrendExample } from "@test/modules/insights/schema/dto/examples/place-elections-turnout-trend.dto.example.ts";

/** Managed by Dryv: PlaceElectionsTurnoutTrendDto enforces exactly what the PlaceElectionsTurnoutTrend contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceElectionsTurnoutTrendDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeElectionsTurnoutTrendExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceElectionsTurnoutTrendDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeElectionsTurnoutTrendExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeElectionsTurnoutTrendExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
