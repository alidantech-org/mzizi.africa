import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceAtPointDto } from "#/modules/geography/schema/dto/place-at-point.dto.ts";
import { placeAtPointExample } from "@test/modules/geography/schema/dto/examples/place-at-point.dto.example.ts";

/** Managed by Dryv: PlaceAtPointDto enforces exactly what the PlaceAtPoint contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceAtPointDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeAtPointExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceAtPointDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeAtPointExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeAtPointExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
