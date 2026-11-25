import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BreakdownsDto } from "#/modules/statistics/schema/dto/breakdowns.dto.ts";
import { breakdownsExample } from "@test/modules/statistics/schema/dto/examples/breakdowns.dto.example.ts";

/** Managed by Dryv: BreakdownsDto enforces exactly what the Breakdowns contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BreakdownsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = breakdownsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BreakdownsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(breakdownsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...breakdownsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
