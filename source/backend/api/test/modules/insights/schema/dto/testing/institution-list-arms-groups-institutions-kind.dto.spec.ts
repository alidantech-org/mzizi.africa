import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionListArmsGroupsInstitutionsKindDto } from "#/modules/insights/schema/dto/institution-list-arms-groups-institutions-kind.dto.ts";
import { institutionListArmsGroupsInstitutionsKindExample } from "@test/modules/insights/schema/dto/examples/institution-list-arms-groups-institutions-kind.dto.example.ts";

/** Managed by Dryv: InstitutionListArmsGroupsInstitutionsKindDto enforces exactly what the InstitutionListArmsGroupsInstitutionsKind contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(
    plainToInstance(InstitutionListArmsGroupsInstitutionsKindDto, value),
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
    },
  );
  return errors.map((error) => error.property);
}

const cases = institutionListArmsGroupsInstitutionsKindExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionListArmsGroupsInstitutionsKindDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionListArmsGroupsInstitutionsKindExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionListArmsGroupsInstitutionsKindExample.valid(),
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
