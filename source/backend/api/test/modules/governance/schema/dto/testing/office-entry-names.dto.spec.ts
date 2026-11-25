import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeEntryNamesDto } from "#/modules/governance/schema/dto/office-entry-names.dto.ts";
import { officeEntryNamesExample } from "@test/modules/governance/schema/dto/examples/office-entry-names.dto.example.ts";

/** Managed by Dryv: OfficeEntryNamesDto enforces exactly what the OfficeEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...officeEntryNamesExample.valid(),
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
