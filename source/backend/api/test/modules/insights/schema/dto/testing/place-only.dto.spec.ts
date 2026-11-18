import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceOnlyDto } from "#/modules/insights/schema/dto/place-only.dto.ts";
import { placeOnlyExample } from "@test/modules/insights/schema/dto/examples/place-only.dto.example.ts";

/** Managed by Dryv: PlaceOnlyDto enforces exactly what the PlaceOnly contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceOnlyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeOnlyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceOnlyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeOnlyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeOnlyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
