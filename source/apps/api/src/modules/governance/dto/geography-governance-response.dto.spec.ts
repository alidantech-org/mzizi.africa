import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeographyGovernanceResponseDto } from "#/modules/governance/dto/geography-governance-response.dto.ts";
import { geographyGovernanceResponseExample } from "#/modules/governance/dto/geography-governance-response.dto.example.ts";

/** Managed by Dryv: GeographyGovernanceResponseDto enforces exactly what the GeographyGovernanceResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeographyGovernanceResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geographyGovernanceResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("GeographyGovernanceResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geographyGovernanceResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...geographyGovernanceResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});