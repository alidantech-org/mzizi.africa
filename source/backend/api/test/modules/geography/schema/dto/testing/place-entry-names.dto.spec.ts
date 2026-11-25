import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceEntryNamesDto } from "#/modules/geography/schema/dto/place-entry-names.dto.ts";
import { placeEntryNamesExample } from "@test/modules/geography/schema/dto/examples/place-entry-names.dto.example.ts";

/** Managed by Dryv: PlaceEntryNamesDto enforces exactly what the PlaceEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeEntryNamesExample.valid(),
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
