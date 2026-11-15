import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeometriesDto } from "#/modules/geography/schema/dto/geometries.dto.ts";
import { geometriesExample } from "@test/modules/geography/schema/dto/examples/geometries.dto.example.ts";

/** Managed by Dryv: GeometriesDto enforces exactly what the Geometries contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeometriesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geometriesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GeometriesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geometriesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...geometriesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
