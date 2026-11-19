import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceElectionsElectionsDto } from "#/modules/insights/schema/dto/place-elections-elections.dto.ts";
import { placeElectionsElectionsExample } from "@test/modules/insights/schema/dto/examples/place-elections-elections.dto.example.ts";

/** Managed by Dryv: PlaceElectionsElectionsDto enforces exactly what the PlaceElectionsElections contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceElectionsElectionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeElectionsElectionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceElectionsElectionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeElectionsElectionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeElectionsElectionsExample.valid(),
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
