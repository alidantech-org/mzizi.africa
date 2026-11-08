import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeographyHierarchyResponseDto } from "#/modules/geography/dto/geography-hierarchy-response.dto.ts";
import { geographyHierarchyResponseExample } from "#/modules/geography/dto/geography-hierarchy-response.dto.example.ts";

/** Managed by Dryv: GeographyHierarchyResponseDto enforces exactly what the GeographyHierarchyResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeographyHierarchyResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geographyHierarchyResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("GeographyHierarchyResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geographyHierarchyResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...geographyHierarchyResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});