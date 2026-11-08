import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProcurementContractResponseDto } from "#/modules/procurement/dto/procurement-contract-response.dto.ts";
import { procurementContractResponseExample } from "#/modules/procurement/dto/procurement-contract-response.dto.example.ts";

/** Managed by Dryv: ProcurementContractResponseDto enforces exactly what the ProcurementContractResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProcurementContractResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = procurementContractResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ProcurementContractResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(procurementContractResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...procurementContractResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});