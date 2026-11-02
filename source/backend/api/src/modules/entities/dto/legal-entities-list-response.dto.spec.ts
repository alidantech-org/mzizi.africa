import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalEntitiesListResponseDto } from "#/modules/entities/dto/legal-entities-list-response.dto.ts";
import { legalEntitiesListResponseExample } from "#/modules/entities/dto/legal-entities-list-response.dto.example.ts";

/** Managed by Dryv: LegalEntitiesListResponseDto enforces exactly what the LegalEntitiesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalEntitiesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalEntitiesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalEntitiesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalEntitiesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalEntitiesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});