import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceElectionsRegistrationTrendDto } from "#/modules/insights/schema/dto/place-elections-registration-trend.dto.ts";
import { placeElectionsRegistrationTrendExample } from "@test/modules/insights/schema/dto/examples/place-elections-registration-trend.dto.example.ts";

/** Managed by Dryv: PlaceElectionsRegistrationTrendDto enforces exactly what the PlaceElectionsRegistrationTrend contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceElectionsRegistrationTrendDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeElectionsRegistrationTrendExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceElectionsRegistrationTrendDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeElectionsRegistrationTrendExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeElectionsRegistrationTrendExample.valid(),
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
