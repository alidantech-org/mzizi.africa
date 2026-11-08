import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProcurementContractPublicDto } from "#/modules/procurement/dto/procurement-contract-public.dto.ts";
import { procurementContractPublicExample } from "#/modules/procurement/dto/procurement-contract-public.dto.example.ts";

/** Managed by Dryv: ProcurementContractPublicDto enforces exactly what the ProcurementContractPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProcurementContractPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = procurementContractPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ProcurementContractPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(procurementContractPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...procurementContractPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});