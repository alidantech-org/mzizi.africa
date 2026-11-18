import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceChildDto } from "#/modules/insights/schema/dto/place-child.dto.ts";
import { placeChildExample } from "@test/modules/insights/schema/dto/examples/place-child.dto.example.ts";

/** Managed by Dryv: PlaceChildDto enforces exactly what the PlaceChild contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceChildDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeChildExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceChildDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeChildExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeChildExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
