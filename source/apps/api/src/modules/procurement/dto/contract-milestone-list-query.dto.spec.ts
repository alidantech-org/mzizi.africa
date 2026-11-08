import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContractMilestoneListQueryDto } from "#/modules/procurement/dto/contract-milestone-list-query.dto.ts";
import { contractMilestoneListQueryExample } from "#/modules/procurement/dto/contract-milestone-list-query.dto.example.ts";

/** Managed by Dryv: ContractMilestoneListQueryDto enforces exactly what the ContractMilestoneListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContractMilestoneListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contractMilestoneListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ContractMilestoneListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contractMilestoneListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contractMilestoneListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});