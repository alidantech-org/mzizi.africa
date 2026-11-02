import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeHoldersListResponseDto } from "#/modules/governance/dto/office-holders-list-response.dto.ts";
import { officeHoldersListResponseExample } from "#/modules/governance/dto/office-holders-list-response.dto.example.ts";

/** Managed by Dryv: OfficeHoldersListResponseDto enforces exactly what the OfficeHoldersListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeHoldersListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeHoldersListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeHoldersListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeHoldersListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeHoldersListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});