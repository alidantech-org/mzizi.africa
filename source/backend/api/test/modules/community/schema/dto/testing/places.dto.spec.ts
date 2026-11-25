import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlacesDto } from "#/modules/community/schema/dto/places.dto.ts";
import { placesExample } from "@test/modules/community/schema/dto/examples/places.dto.example.ts";

/** Managed by Dryv: PlacesDto enforces exactly what the Places contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlacesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlacesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
