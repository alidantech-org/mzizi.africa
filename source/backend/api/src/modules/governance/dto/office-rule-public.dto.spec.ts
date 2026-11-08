import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeRulePublicDto } from "#/modules/governance/dto/office-rule-public.dto.ts";
import { officeRulePublicExample } from "#/modules/governance/dto/office-rule-public.dto.example.ts";

/** Managed by Dryv: OfficeRulePublicDto enforces exactly what the OfficeRulePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeRulePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeRulePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeRulePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeRulePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeRulePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});