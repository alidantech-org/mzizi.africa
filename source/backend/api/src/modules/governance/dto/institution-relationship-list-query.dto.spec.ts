import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionRelationshipListQueryDto } from "#/modules/governance/dto/institution-relationship-list-query.dto.ts";
import { institutionRelationshipListQueryExample } from "#/modules/governance/dto/institution-relationship-list-query.dto.example.ts";

/** Managed by Dryv: InstitutionRelationshipListQueryDto enforces exactly what the InstitutionRelationshipListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionRelationshipListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionRelationshipListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionRelationshipListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionRelationshipListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...institutionRelationshipListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});