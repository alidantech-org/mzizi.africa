import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionListArmsGroupsInstitutionsParentDto } from "#/modules/insights/schema/dto/institution-list-arms-groups-institutions-parent.dto.ts";
import { institutionListArmsGroupsInstitutionsParentExample } from "@test/modules/insights/schema/dto/examples/institution-list-arms-groups-institutions-parent.dto.example.ts";

/** Managed by Dryv: InstitutionListArmsGroupsInstitutionsParentDto enforces exactly what the InstitutionListArmsGroupsInstitutionsParent contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(
    plainToInstance(InstitutionListArmsGroupsInstitutionsParentDto, value),
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
    },
  );
  return errors.map((error) => error.property);
}

const cases = institutionListArmsGroupsInstitutionsParentExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionListArmsGroupsInstitutionsParentDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionListArmsGroupsInstitutionsParentExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionListArmsGroupsInstitutionsParentExample.valid(),
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
