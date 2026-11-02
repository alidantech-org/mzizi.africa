import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeoBoundaryVersionDto } from "#/modules/geography/dto/geo-boundary-version.dto.ts";
import { geoBoundaryVersionExample } from "#/modules/geography/dto/geo-boundary-version.dto.example.ts";

/** Managed by Dryv: GeoBoundaryVersionDto enforces exactly what the GeoBoundaryVersion contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeoBoundaryVersionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geoBoundaryVersionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GeoBoundaryVersionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geoBoundaryVersionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...geoBoundaryVersionExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
