import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailInstitutionDto } from "#/modules/insights/schema/dto/institution-detail-institution.dto.ts";
import { institutionDetailInstitutionExample } from "@test/modules/insights/schema/dto/examples/institution-detail-institution.dto.example.ts";

/** Managed by Dryv: InstitutionDetailInstitutionDto enforces exactly what the InstitutionDetailInstitution contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailInstitutionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailInstitutionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailInstitutionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailInstitutionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailInstitutionExample.valid(),
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
