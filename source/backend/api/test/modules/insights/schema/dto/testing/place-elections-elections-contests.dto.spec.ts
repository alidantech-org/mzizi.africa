import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceElectionsElectionsContestsDto } from "#/modules/insights/schema/dto/place-elections-elections-contests.dto.ts";
import { placeElectionsElectionsContestsExample } from "@test/modules/insights/schema/dto/examples/place-elections-elections-contests.dto.example.ts";

/** Managed by Dryv: PlaceElectionsElectionsContestsDto enforces exactly what the PlaceElectionsElectionsContests contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceElectionsElectionsContestsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeElectionsElectionsContestsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceElectionsElectionsContestsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeElectionsElectionsContestsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeElectionsElectionsContestsExample.valid(),
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
