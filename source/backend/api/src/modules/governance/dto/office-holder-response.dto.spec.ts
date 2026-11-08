import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeHolderResponseDto } from "#/modules/governance/dto/office-holder-response.dto.ts";
import { officeHolderResponseExample } from "#/modules/governance/dto/office-holder-response.dto.example.ts";

/** Managed by Dryv: OfficeHolderResponseDto enforces exactly what the OfficeHolderResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeHolderResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeHolderResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeHolderResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeHolderResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeHolderResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});