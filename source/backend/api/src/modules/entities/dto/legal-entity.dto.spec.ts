import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalEntityDto } from "#/modules/entities/dto/legal-entity.dto.ts";
import { legalEntityExample } from "#/modules/entities/dto/legal-entity.dto.example.ts";

/** Managed by Dryv: LegalEntityDto enforces exactly what the LegalEntity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalEntityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalEntityExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalEntityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalEntityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalEntityExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});