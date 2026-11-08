import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeHolderSearchResponseDto } from "#/modules/governance/dto/office-holder-search-response.dto.ts";
import { officeHolderSearchResponseExample } from "#/modules/governance/dto/office-holder-search-response.dto.example.ts";

/** Managed by Dryv: OfficeHolderSearchResponseDto enforces exactly what the OfficeHolderSearchResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeHolderSearchResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeHolderSearchResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeHolderSearchResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeHolderSearchResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeHolderSearchResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});