import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailOfficesNamesDto } from "#/modules/governance/schema/dto/institution-detail-offices-names.dto.ts";
import { institutionDetailOfficesNamesExample } from "@test/modules/governance/schema/dto/examples/institution-detail-offices-names.dto.example.ts";

/** Managed by Dryv: InstitutionDetailOfficesNamesDto enforces exactly what the InstitutionDetailOfficesNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailOfficesNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailOfficesNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailOfficesNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailOfficesNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailOfficesNamesExample.valid(),
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
