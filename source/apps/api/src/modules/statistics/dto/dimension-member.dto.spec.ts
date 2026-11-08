import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DimensionMemberDto } from "#/modules/statistics/dto/dimension-member.dto.ts";
import { dimensionMemberExample } from "#/modules/statistics/dto/dimension-member.dto.example.ts";

/** Managed by Dryv: DimensionMemberDto enforces exactly what the DimensionMember contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DimensionMemberDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = dimensionMemberExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DimensionMemberDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(dimensionMemberExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...dimensionMemberExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});