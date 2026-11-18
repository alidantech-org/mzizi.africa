import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BeneficiariesDto } from "#/modules/civic/schema/dto/beneficiaries.dto.ts";
import { beneficiariesExample } from "@test/modules/civic/schema/dto/examples/beneficiaries.dto.example.ts";

/** Managed by Dryv: BeneficiariesDto enforces exactly what the Beneficiaries contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BeneficiariesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = beneficiariesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BeneficiariesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(beneficiariesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...beneficiariesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
