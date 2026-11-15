import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailOfficesDto } from "#/modules/governance/dto/institution-detail-offices.dto.ts";
import { institutionDetailOfficesExample } from "#/modules/governance/dto/institution-detail-offices.dto.example.ts";

/** Managed by Dryv: InstitutionDetailOfficesDto enforces exactly what the InstitutionDetailOffices contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailOfficesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailOfficesExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailOfficesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailOfficesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...institutionDetailOfficesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});