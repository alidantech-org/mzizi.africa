import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceDetailNamesDto } from "#/modules/geography/schema/dto/place-detail-names.dto.ts";
import { placeDetailNamesExample } from "@test/modules/geography/schema/dto/examples/place-detail-names.dto.example.ts";

/** Managed by Dryv: PlaceDetailNamesDto enforces exactly what the PlaceDetailNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceDetailNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeDetailNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceDetailNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeDetailNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeDetailNamesExample.valid(),
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
