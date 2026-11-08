import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeRuleResponseDto } from "#/modules/governance/dto/office-rule-response.dto.ts";
import { officeRuleResponseExample } from "#/modules/governance/dto/office-rule-response.dto.example.ts";

/** Managed by Dryv: OfficeRuleResponseDto enforces exactly what the OfficeRuleResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeRuleResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeRuleResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeRuleResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeRuleResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeRuleResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});