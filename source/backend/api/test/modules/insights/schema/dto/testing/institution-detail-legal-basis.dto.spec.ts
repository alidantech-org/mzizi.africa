import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailLegalBasisDto } from "#/modules/insights/schema/dto/institution-detail-legal-basis.dto.ts";
import { institutionDetailLegalBasisExample } from "@test/modules/insights/schema/dto/examples/institution-detail-legal-basis.dto.example.ts";

/** Managed by Dryv: InstitutionDetailLegalBasisDto enforces exactly what the InstitutionDetailLegalBasis contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailLegalBasisDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailLegalBasisExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailLegalBasisDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailLegalBasisExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailLegalBasisExample.valid(),
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
