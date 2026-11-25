import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeEntryHoldersNamesDto } from "#/modules/governance/schema/dto/office-entry-holders-names.dto.ts";
import { officeEntryHoldersNamesExample } from "@test/modules/governance/schema/dto/examples/office-entry-holders-names.dto.example.ts";

/** Managed by Dryv: OfficeEntryHoldersNamesDto enforces exactly what the OfficeEntryHoldersNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeEntryHoldersNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeEntryHoldersNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeEntryHoldersNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeEntryHoldersNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...officeEntryHoldersNamesExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
