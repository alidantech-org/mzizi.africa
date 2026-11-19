import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailInstitutionBasisDto } from "#/modules/insights/schema/dto/institution-detail-institution-basis.dto.ts";
import { institutionDetailInstitutionBasisExample } from "@test/modules/insights/schema/dto/examples/institution-detail-institution-basis.dto.example.ts";

/** Managed by Dryv: InstitutionDetailInstitutionBasisDto enforces exactly what the InstitutionDetailInstitutionBasis contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailInstitutionBasisDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailInstitutionBasisExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailInstitutionBasisDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailInstitutionBasisExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailInstitutionBasisExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
