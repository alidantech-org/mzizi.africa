import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PatternsDto } from "#/modules/governance/schema/dto/patterns.dto.ts";
import { patternsExample } from "@test/modules/governance/schema/dto/examples/patterns.dto.example.ts";

/** Managed by Dryv: PatternsDto enforces exactly what the Patterns contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PatternsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = patternsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PatternsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(patternsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...patternsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
