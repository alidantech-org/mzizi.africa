import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeographyBoundariesQueryDto } from "#/modules/geography/dto/geography-boundaries-query.dto.ts";
import { geographyBoundariesQueryExample } from "#/modules/geography/dto/geography-boundaries-query.dto.example.ts";

/** Managed by Dryv: GeographyBoundariesQueryDto enforces exactly what the GeographyBoundariesQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeographyBoundariesQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geographyBoundariesQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("GeographyBoundariesQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geographyBoundariesQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...geographyBoundariesQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});