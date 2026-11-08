import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContractMilestoneDto } from "#/modules/procurement/dto/contract-milestone.dto.ts";
import { contractMilestoneExample } from "#/modules/procurement/dto/contract-milestone.dto.example.ts";

/** Managed by Dryv: ContractMilestoneDto enforces exactly what the ContractMilestone contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContractMilestoneDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contractMilestoneExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ContractMilestoneDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contractMilestoneExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contractMilestoneExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});