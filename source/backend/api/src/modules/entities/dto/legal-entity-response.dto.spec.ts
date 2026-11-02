import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalEntityResponseDto } from "#/modules/entities/dto/legal-entity-response.dto.ts";
import { legalEntityResponseExample } from "#/modules/entities/dto/legal-entity-response.dto.example.ts";

/** Managed by Dryv: LegalEntityResponseDto enforces exactly what the LegalEntityResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalEntityResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalEntityResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalEntityResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalEntityResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalEntityResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});