import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeDto } from "#/modules/governance/dto/office.dto.ts";
import { officeExample } from "#/modules/governance/dto/office.dto.example.ts";

/** Managed by Dryv: OfficeDto enforces exactly what the Office contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});