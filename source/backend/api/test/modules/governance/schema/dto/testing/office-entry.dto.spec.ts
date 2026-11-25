import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeEntryDto } from "#/modules/governance/schema/dto/office-entry.dto.ts";
import { officeEntryExample } from "@test/modules/governance/schema/dto/examples/office-entry.dto.example.ts";

/** Managed by Dryv: OfficeEntryDto enforces exactly what the OfficeEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
