import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeRuleListQueryDto } from "#/modules/governance/dto/office-rule-list-query.dto.ts";
import { officeRuleListQueryExample } from "#/modules/governance/dto/office-rule-list-query.dto.example.ts";

/** Managed by Dryv: OfficeRuleListQueryDto enforces exactly what the OfficeRuleListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeRuleListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeRuleListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeRuleListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeRuleListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeRuleListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});