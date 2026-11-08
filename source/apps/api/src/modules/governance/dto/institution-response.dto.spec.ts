import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionResponseDto } from "#/modules/governance/dto/institution-response.dto.ts";
import { institutionResponseExample } from "#/modules/governance/dto/institution-response.dto.example.ts";

/** Managed by Dryv: InstitutionResponseDto enforces exactly what the InstitutionResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...institutionResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});