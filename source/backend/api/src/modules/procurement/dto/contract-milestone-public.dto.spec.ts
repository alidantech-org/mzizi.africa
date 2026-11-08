import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContractMilestonePublicDto } from "#/modules/procurement/dto/contract-milestone-public.dto.ts";
import { contractMilestonePublicExample } from "#/modules/procurement/dto/contract-milestone-public.dto.example.ts";

/** Managed by Dryv: ContractMilestonePublicDto enforces exactly what the ContractMilestonePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContractMilestonePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contractMilestonePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ContractMilestonePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contractMilestonePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contractMilestonePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});