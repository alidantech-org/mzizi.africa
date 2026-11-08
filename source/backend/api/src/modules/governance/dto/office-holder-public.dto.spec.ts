import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeHolderPublicDto } from "#/modules/governance/dto/office-holder-public.dto.ts";
import { officeHolderPublicExample } from "#/modules/governance/dto/office-holder-public.dto.example.ts";

/** Managed by Dryv: OfficeHolderPublicDto enforces exactly what the OfficeHolderPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeHolderPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeHolderPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeHolderPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeHolderPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeHolderPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});