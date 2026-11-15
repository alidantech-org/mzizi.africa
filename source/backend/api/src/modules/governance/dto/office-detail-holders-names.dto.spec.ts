import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeDetailHoldersNamesDto } from "#/modules/governance/dto/office-detail-holders-names.dto.ts";
import { officeDetailHoldersNamesExample } from "#/modules/governance/dto/office-detail-holders-names.dto.example.ts";

/** Managed by Dryv: OfficeDetailHoldersNamesDto enforces exactly what the OfficeDetailHoldersNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeDetailHoldersNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeDetailHoldersNamesExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeDetailHoldersNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeDetailHoldersNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeDetailHoldersNamesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});