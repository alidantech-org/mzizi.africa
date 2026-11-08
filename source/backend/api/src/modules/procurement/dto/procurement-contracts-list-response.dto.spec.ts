import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProcurementContractsListResponseDto } from "#/modules/procurement/dto/procurement-contracts-list-response.dto.ts";
import { procurementContractsListResponseExample } from "#/modules/procurement/dto/procurement-contracts-list-response.dto.example.ts";

/** Managed by Dryv: ProcurementContractsListResponseDto enforces exactly what the ProcurementContractsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProcurementContractsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = procurementContractsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ProcurementContractsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(procurementContractsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...procurementContractsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});