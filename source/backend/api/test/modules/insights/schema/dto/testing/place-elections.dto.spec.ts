import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceElectionsDto } from "#/modules/insights/schema/dto/place-elections.dto.ts";
import { placeElectionsExample } from "@test/modules/insights/schema/dto/examples/place-elections.dto.example.ts";

/** Managed by Dryv: PlaceElectionsDto enforces exactly what the PlaceElections contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceElectionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeElectionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceElectionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeElectionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeElectionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
