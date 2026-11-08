import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContractVariationsListResponseDto } from "#/modules/procurement/dto/contract-variations-list-response.dto.ts";
import { contractVariationsListResponseExample } from "#/modules/procurement/dto/contract-variations-list-response.dto.example.ts";

/** Managed by Dryv: ContractVariationsListResponseDto enforces exactly what the ContractVariationsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContractVariationsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contractVariationsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ContractVariationsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contractVariationsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contractVariationsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});