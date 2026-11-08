import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DimensionMemberResponseDto } from "#/modules/statistics/dto/dimension-member-response.dto.ts";
import { dimensionMemberResponseExample } from "#/modules/statistics/dto/dimension-member-response.dto.example.ts";

/** Managed by Dryv: DimensionMemberResponseDto enforces exactly what the DimensionMemberResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DimensionMemberResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = dimensionMemberResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DimensionMemberResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(dimensionMemberResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...dimensionMemberResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});