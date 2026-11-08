import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContractVariationResponseDto } from "#/modules/procurement/dto/contract-variation-response.dto.ts";
import { contractVariationResponseExample } from "#/modules/procurement/dto/contract-variation-response.dto.example.ts";

/** Managed by Dryv: ContractVariationResponseDto enforces exactly what the ContractVariationResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContractVariationResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contractVariationResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ContractVariationResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contractVariationResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contractVariationResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});