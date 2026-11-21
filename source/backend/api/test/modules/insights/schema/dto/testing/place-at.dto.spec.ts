import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceAtDto } from "#/modules/insights/schema/dto/place-at.dto.ts";
import { placeAtExample } from "@test/modules/insights/schema/dto/examples/place-at.dto.example.ts";

/** Managed by Dryv: PlaceAtDto enforces exactly what the PlaceAt contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceAtDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeAtExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceAtDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeAtExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeAtExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
