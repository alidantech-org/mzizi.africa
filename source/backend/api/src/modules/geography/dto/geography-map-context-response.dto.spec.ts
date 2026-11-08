import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeographyMapContextResponseDto } from "#/modules/geography/dto/geography-map-context-response.dto.ts";
import { geographyMapContextResponseExample } from "#/modules/geography/dto/geography-map-context-response.dto.example.ts";

/** Managed by Dryv: GeographyMapContextResponseDto enforces exactly what the GeographyMapContextResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeographyMapContextResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geographyMapContextResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("GeographyMapContextResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geographyMapContextResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...geographyMapContextResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});