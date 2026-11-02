import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeResponseDto } from "#/modules/governance/dto/office-response.dto.ts";
import { officeResponseExample } from "#/modules/governance/dto/office-response.dto.example.ts";

/** Managed by Dryv: OfficeResponseDto enforces exactly what the OfficeResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});