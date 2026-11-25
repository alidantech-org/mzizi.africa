import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceRequestDto } from "#/modules/frontend/schema/dto/place-request.dto.ts";
import { placeRequestExample } from "@test/modules/frontend/schema/dto/examples/place-request.dto.example.ts";

/** Managed by Dryv: PlaceRequestDto enforces exactly what the PlaceRequest contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceRequestDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeRequestExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceRequestDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeRequestExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeRequestExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
