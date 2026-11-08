import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DimensionListQueryDto } from "#/modules/statistics/dto/dimension-list-query.dto.ts";
import { dimensionListQueryExample } from "#/modules/statistics/dto/dimension-list-query.dto.example.ts";

/** Managed by Dryv: DimensionListQueryDto enforces exactly what the DimensionListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DimensionListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = dimensionListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DimensionListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(dimensionListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...dimensionListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});