import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContractVariationListQueryDto } from "#/modules/procurement/dto/contract-variation-list-query.dto.ts";
import { contractVariationListQueryExample } from "#/modules/procurement/dto/contract-variation-list-query.dto.example.ts";

/** Managed by Dryv: ContractVariationListQueryDto enforces exactly what the ContractVariationListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContractVariationListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contractVariationListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ContractVariationListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contractVariationListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contractVariationListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});