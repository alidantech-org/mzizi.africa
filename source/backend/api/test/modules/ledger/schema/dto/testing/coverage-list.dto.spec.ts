import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CoverageListDto } from "#/modules/ledger/schema/dto/coverage-list.dto.ts";
import { coverageListExample } from "@test/modules/ledger/schema/dto/examples/coverage-list.dto.example.ts";

/** Managed by Dryv: CoverageListDto enforces exactly what the CoverageList contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CoverageListDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = coverageListExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CoverageListDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(coverageListExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...coverageListExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
