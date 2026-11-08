import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContractVariationPublicDto } from "#/modules/procurement/dto/contract-variation-public.dto.ts";
import { contractVariationPublicExample } from "#/modules/procurement/dto/contract-variation-public.dto.example.ts";

/** Managed by Dryv: ContractVariationPublicDto enforces exactly what the ContractVariationPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContractVariationPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contractVariationPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ContractVariationPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contractVariationPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contractVariationPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});