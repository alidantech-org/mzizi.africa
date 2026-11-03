import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeHolderSearchQueryDto } from "#/modules/governance/dto/office-holder-search-query.dto.ts";
import { officeHolderSearchQueryExample } from "#/modules/governance/dto/office-holder-search-query.dto.example.ts";

/** Managed by Dryv: OfficeHolderSearchQueryDto enforces exactly what the OfficeHolderSearchQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeHolderSearchQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeHolderSearchQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeHolderSearchQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeHolderSearchQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeHolderSearchQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});