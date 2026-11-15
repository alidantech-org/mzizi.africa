import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailMandatesDto } from "#/modules/governance/schema/dto/institution-detail-mandates.dto.ts";
import { institutionDetailMandatesExample } from "#/modules/governance/schema/dto/examples/institution-detail-mandates.dto.example.ts";

/** Managed by Dryv: InstitutionDetailMandatesDto enforces exactly what the InstitutionDetailMandates contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailMandatesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailMandatesExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailMandatesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailMandatesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...institutionDetailMandatesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});