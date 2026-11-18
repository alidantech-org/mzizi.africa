import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CompareOptionsDto } from "#/modules/insights/schema/dto/compare-options.dto.ts";
import { compareOptionsExample } from "@test/modules/insights/schema/dto/examples/compare-options.dto.example.ts";

/** Managed by Dryv: CompareOptionsDto enforces exactly what the CompareOptions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CompareOptionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = compareOptionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CompareOptionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(compareOptionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...compareOptionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
