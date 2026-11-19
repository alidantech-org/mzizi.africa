import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CoverageItemDto } from "#/modules/ledger/schema/dto/coverage-item.dto.ts";
import { coverageItemExample } from "@test/modules/ledger/schema/dto/examples/coverage-item.dto.example.ts";

/** Managed by Dryv: CoverageItemDto enforces exactly what the CoverageItem contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CoverageItemDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = coverageItemExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CoverageItemDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(coverageItemExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...coverageItemExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
