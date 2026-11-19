import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailInstitutionParentDto } from "#/modules/insights/schema/dto/institution-detail-institution-parent.dto.ts";
import { institutionDetailInstitutionParentExample } from "@test/modules/insights/schema/dto/examples/institution-detail-institution-parent.dto.example.ts";

/** Managed by Dryv: InstitutionDetailInstitutionParentDto enforces exactly what the InstitutionDetailInstitutionParent contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailInstitutionParentDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailInstitutionParentExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailInstitutionParentDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailInstitutionParentExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailInstitutionParentExample.valid(),
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
