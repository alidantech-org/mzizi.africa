import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContractsDto } from "#/modules/civic/schema/dto/contracts.dto.ts";
import { contractsExample } from "@test/modules/civic/schema/dto/examples/contracts.dto.example.ts";

/** Managed by Dryv: ContractsDto enforces exactly what the Contracts contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContractsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contractsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContractsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contractsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contractsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
