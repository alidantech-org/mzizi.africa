import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeHolderSearchItemDto } from "#/modules/governance/dto/office-holder-search-item.dto.ts";
import { officeHolderSearchItemExample } from "#/modules/governance/dto/office-holder-search-item.dto.example.ts";

/** Managed by Dryv: OfficeHolderSearchItemDto enforces exactly what the OfficeHolderSearchItem contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeHolderSearchItemDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeHolderSearchItemExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeHolderSearchItemDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeHolderSearchItemExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeHolderSearchItemExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});