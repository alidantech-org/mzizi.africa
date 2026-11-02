import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionRelationshipResponseDto } from "#/modules/governance/dto/institution-relationship-response.dto.ts";
import { institutionRelationshipResponseExample } from "#/modules/governance/dto/institution-relationship-response.dto.example.ts";

/** Managed by Dryv: InstitutionRelationshipResponseDto enforces exactly what the InstitutionRelationshipResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionRelationshipResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionRelationshipResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionRelationshipResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionRelationshipResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...institutionRelationshipResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});