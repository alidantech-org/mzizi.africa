import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionEntryDto } from "#/modules/governance/schema/dto/institution-entry.dto.ts";
import { institutionEntryExample } from "#/modules/governance/schema/dto/examples/institution-entry.dto.example.ts";

/** Managed by Dryv: InstitutionEntryDto enforces exactly what the InstitutionEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionEntryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...institutionEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});