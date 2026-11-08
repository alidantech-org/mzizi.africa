import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalProvisionDto } from "#/modules/legal/dto/legal-provision.dto.ts";
import { legalProvisionExample } from "#/modules/legal/dto/legal-provision.dto.example.ts";

/** Managed by Dryv: LegalProvisionDto enforces exactly what the LegalProvision contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalProvisionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalProvisionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalProvisionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalProvisionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalProvisionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});