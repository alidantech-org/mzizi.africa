import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LocationDto } from "#/modules/explorer/schema/dto/location.dto.ts";
import { locationExample } from "@test/modules/explorer/schema/dto/examples/location.dto.example.ts";

/** Managed by Dryv: LocationDto enforces exactly what the Location contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LocationDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = locationExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LocationDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(locationExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...locationExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
