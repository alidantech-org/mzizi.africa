import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObligationsDto } from "#/modules/governance/schema/dto/obligations.dto.ts";
import { obligationsExample } from "@test/modules/governance/schema/dto/examples/obligations.dto.example.ts";

/** Managed by Dryv: ObligationsDto enforces exactly what the Obligations contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObligationsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = obligationsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ObligationsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(obligationsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...obligationsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
