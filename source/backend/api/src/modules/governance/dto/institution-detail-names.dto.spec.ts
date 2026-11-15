import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailNamesDto } from "#/modules/governance/dto/institution-detail-names.dto.ts";
import { institutionDetailNamesExample } from "#/modules/governance/dto/institution-detail-names.dto.example.ts";

/** Managed by Dryv: InstitutionDetailNamesDto enforces exactly what the InstitutionDetailNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailNamesExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...institutionDetailNamesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});