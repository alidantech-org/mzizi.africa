import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceScreenDto } from "#/modules/frontend/schema/dto/place-screen.dto.ts";
import { placeScreenExample } from "@test/modules/frontend/schema/dto/examples/place-screen.dto.example.ts";

/** Managed by Dryv: PlaceScreenDto enforces exactly what the PlaceScreen contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceScreenDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeScreenExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceScreenDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeScreenExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeScreenExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
