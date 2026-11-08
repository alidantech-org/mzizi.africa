import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDto } from "#/modules/governance/dto/institution.dto.ts";
import { institutionExample } from "#/modules/governance/dto/institution.dto.example.ts";

/** Managed by Dryv: InstitutionDto enforces exactly what the Institution contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...institutionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});