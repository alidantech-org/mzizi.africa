import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailInstitutionArmDto } from "#/modules/insights/schema/dto/institution-detail-institution-arm.dto.ts";
import { institutionDetailInstitutionArmExample } from "@test/modules/insights/schema/dto/examples/institution-detail-institution-arm.dto.example.ts";

/** Managed by Dryv: InstitutionDetailInstitutionArmDto enforces exactly what the InstitutionDetailInstitutionArm contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailInstitutionArmDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailInstitutionArmExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailInstitutionArmDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailInstitutionArmExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailInstitutionArmExample.valid(),
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
