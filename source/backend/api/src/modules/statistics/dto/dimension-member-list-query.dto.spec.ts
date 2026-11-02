import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DimensionMemberListQueryDto } from "#/modules/statistics/dto/dimension-member-list-query.dto.ts";
import { dimensionMemberListQueryExample } from "#/modules/statistics/dto/dimension-member-list-query.dto.example.ts";

/** Managed by Dryv: DimensionMemberListQueryDto enforces exactly what the DimensionMemberListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DimensionMemberListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = dimensionMemberListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DimensionMemberListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(dimensionMemberListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...dimensionMemberListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});