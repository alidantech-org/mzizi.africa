import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceEntryDto } from "#/modules/geography/schema/dto/place-entry.dto.ts";
import { placeEntryExample } from "@test/modules/geography/schema/dto/examples/place-entry.dto.example.ts";

/** Managed by Dryv: PlaceEntryDto enforces exactly what the PlaceEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
