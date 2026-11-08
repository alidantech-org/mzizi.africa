import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { VintageResponseDto } from "#/modules/statistics/dto/vintage-response.dto.ts";
import { vintageResponseExample } from "#/modules/statistics/dto/vintage-response.dto.example.ts";

/** Managed by Dryv: VintageResponseDto enforces exactly what the VintageResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(VintageResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = vintageResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("VintageResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(vintageResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...vintageResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});