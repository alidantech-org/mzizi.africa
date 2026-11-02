import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeRuleDto } from "#/modules/governance/dto/office-rule.dto.ts";
import { officeRuleExample } from "#/modules/governance/dto/office-rule.dto.example.ts";

/** Managed by Dryv: OfficeRuleDto enforces exactly what the OfficeRule contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeRuleDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeRuleExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeRuleDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeRuleExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeRuleExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});