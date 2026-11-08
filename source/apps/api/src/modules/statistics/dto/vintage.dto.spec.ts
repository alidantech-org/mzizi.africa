import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { VintageDto } from "#/modules/statistics/dto/vintage.dto.ts";
import { vintageExample } from "#/modules/statistics/dto/vintage.dto.example.ts";

/** Managed by Dryv: VintageDto enforces exactly what the Vintage contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(VintageDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = vintageExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("VintageDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(vintageExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...vintageExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});