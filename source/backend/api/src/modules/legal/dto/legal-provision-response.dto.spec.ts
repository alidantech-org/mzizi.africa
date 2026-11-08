import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalProvisionResponseDto } from "#/modules/legal/dto/legal-provision-response.dto.ts";
import { legalProvisionResponseExample } from "#/modules/legal/dto/legal-provision-response.dto.example.ts";

/** Managed by Dryv: LegalProvisionResponseDto enforces exactly what the LegalProvisionResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalProvisionResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalProvisionResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalProvisionResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalProvisionResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalProvisionResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});