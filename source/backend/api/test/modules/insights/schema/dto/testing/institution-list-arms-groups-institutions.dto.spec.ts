import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionListArmsGroupsInstitutionsDto } from "#/modules/insights/schema/dto/institution-list-arms-groups-institutions.dto.ts";
import { institutionListArmsGroupsInstitutionsExample } from "@test/modules/insights/schema/dto/examples/institution-list-arms-groups-institutions.dto.example.ts";

/** Managed by Dryv: InstitutionListArmsGroupsInstitutionsDto enforces exactly what the InstitutionListArmsGroupsInstitutions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionListArmsGroupsInstitutionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionListArmsGroupsInstitutionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionListArmsGroupsInstitutionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionListArmsGroupsInstitutionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionListArmsGroupsInstitutionsExample.valid(),
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
