import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceInputDto } from "#/modules/locality/schema/dto/place-input.dto.ts";
import { placeInputExample } from "@test/modules/locality/schema/dto/examples/place-input.dto.example.ts";

/** Managed by Dryv: PlaceInputDto enforces exactly what the PlaceInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
