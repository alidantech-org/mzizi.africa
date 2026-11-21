import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LocationInputDto } from "#/modules/explorer/schema/dto/location-input.dto.ts";
import { locationInputExample } from "@test/modules/explorer/schema/dto/examples/location-input.dto.example.ts";

/** Managed by Dryv: LocationInputDto enforces exactly what the LocationInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LocationInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = locationInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LocationInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(locationInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...locationInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
