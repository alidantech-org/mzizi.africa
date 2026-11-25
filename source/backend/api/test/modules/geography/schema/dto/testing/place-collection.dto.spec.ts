import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceCollectionDto } from "#/modules/geography/schema/dto/place-collection.dto.ts";
import { placeCollectionExample } from "@test/modules/geography/schema/dto/examples/place-collection.dto.example.ts";

/** Managed by Dryv: PlaceCollectionDto enforces exactly what the PlaceCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeCollectionExample.valid(),
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
