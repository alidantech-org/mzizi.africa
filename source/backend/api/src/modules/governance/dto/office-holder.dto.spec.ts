import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeHolderDto } from "#/modules/governance/dto/office-holder.dto.ts";
import { officeHolderExample } from "#/modules/governance/dto/office-holder.dto.example.ts";

/** Managed by Dryv: OfficeHolderDto enforces exactly what the OfficeHolder contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeHolderDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeHolderExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeHolderDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeHolderExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeHolderExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});