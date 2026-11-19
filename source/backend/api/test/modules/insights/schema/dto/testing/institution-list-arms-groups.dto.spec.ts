import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionListArmsGroupsDto } from "#/modules/insights/schema/dto/institution-list-arms-groups.dto.ts";
import { institutionListArmsGroupsExample } from "@test/modules/insights/schema/dto/examples/institution-list-arms-groups.dto.example.ts";

/** Managed by Dryv: InstitutionListArmsGroupsDto enforces exactly what the InstitutionListArmsGroups contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionListArmsGroupsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionListArmsGroupsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionListArmsGroupsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionListArmsGroupsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionListArmsGroupsExample.valid(),
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
