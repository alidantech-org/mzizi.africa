import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeographySearchQueryDto } from "#/modules/geography/dto/geography-search-query.dto.ts";
import { geographySearchQueryExample } from "#/modules/geography/dto/geography-search-query.dto.example.ts";

/** Managed by Dryv: GeographySearchQueryDto enforces exactly what the GeographySearchQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeographySearchQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geographySearchQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("GeographySearchQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geographySearchQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...geographySearchQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});