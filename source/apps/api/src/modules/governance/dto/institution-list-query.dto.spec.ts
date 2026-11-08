import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionListQueryDto } from "#/modules/governance/dto/institution-list-query.dto.ts";
import { institutionListQueryExample } from "#/modules/governance/dto/institution-list-query.dto.example.ts";

/** Managed by Dryv: InstitutionListQueryDto enforces exactly what the InstitutionListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...institutionListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});