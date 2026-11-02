import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContractMilestoneResponseDto } from "#/modules/procurement/dto/contract-milestone-response.dto.ts";
import { contractMilestoneResponseExample } from "#/modules/procurement/dto/contract-milestone-response.dto.example.ts";

/** Managed by Dryv: ContractMilestoneResponseDto enforces exactly what the ContractMilestoneResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContractMilestoneResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contractMilestoneResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ContractMilestoneResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contractMilestoneResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contractMilestoneResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});