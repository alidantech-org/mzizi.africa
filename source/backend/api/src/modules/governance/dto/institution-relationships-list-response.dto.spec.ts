import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionRelationshipsListResponseDto } from "#/modules/governance/dto/institution-relationships-list-response.dto.ts";
import { institutionRelationshipsListResponseExample } from "#/modules/governance/dto/institution-relationships-list-response.dto.example.ts";

/** Managed by Dryv: InstitutionRelationshipsListResponseDto enforces exactly what the InstitutionRelationshipsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionRelationshipsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionRelationshipsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionRelationshipsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionRelationshipsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...institutionRelationshipsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});