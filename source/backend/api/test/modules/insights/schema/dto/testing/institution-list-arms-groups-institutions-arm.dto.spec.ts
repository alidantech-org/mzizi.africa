import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionListArmsGroupsInstitutionsArmDto } from "#/modules/insights/schema/dto/institution-list-arms-groups-institutions-arm.dto.ts";
import { institutionListArmsGroupsInstitutionsArmExample } from "@test/modules/insights/schema/dto/examples/institution-list-arms-groups-institutions-arm.dto.example.ts";

/** Managed by Dryv: InstitutionListArmsGroupsInstitutionsArmDto enforces exactly what the InstitutionListArmsGroupsInstitutionsArm contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(
    plainToInstance(InstitutionListArmsGroupsInstitutionsArmDto, value),
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
    },
  );
  return errors.map((error) => error.property);
}

const cases = institutionListArmsGroupsInstitutionsArmExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionListArmsGroupsInstitutionsArmDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionListArmsGroupsInstitutionsArmExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionListArmsGroupsInstitutionsArmExample.valid(),
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
