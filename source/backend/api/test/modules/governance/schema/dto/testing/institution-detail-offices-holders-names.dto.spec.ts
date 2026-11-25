import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailOfficesHoldersNamesDto } from "#/modules/governance/schema/dto/institution-detail-offices-holders-names.dto.ts";
import { institutionDetailOfficesHoldersNamesExample } from "@test/modules/governance/schema/dto/examples/institution-detail-offices-holders-names.dto.example.ts";

/** Managed by Dryv: InstitutionDetailOfficesHoldersNamesDto enforces exactly what the InstitutionDetailOfficesHoldersNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailOfficesHoldersNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailOfficesHoldersNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailOfficesHoldersNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailOfficesHoldersNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailOfficesHoldersNamesExample.valid(),
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
