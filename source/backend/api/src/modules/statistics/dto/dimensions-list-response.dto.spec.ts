import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DimensionsListResponseDto } from "#/modules/statistics/dto/dimensions-list-response.dto.ts";
import { dimensionsListResponseExample } from "#/modules/statistics/dto/dimensions-list-response.dto.example.ts";

/** Managed by Dryv: DimensionsListResponseDto enforces exactly what the DimensionsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DimensionsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = dimensionsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DimensionsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(dimensionsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...dimensionsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});