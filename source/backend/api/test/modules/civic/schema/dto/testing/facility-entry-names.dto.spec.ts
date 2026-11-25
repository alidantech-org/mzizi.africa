import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FacilityEntryNamesDto } from "#/modules/civic/schema/dto/facility-entry-names.dto.ts";
import { facilityEntryNamesExample } from "@test/modules/civic/schema/dto/examples/facility-entry-names.dto.example.ts";

/** Managed by Dryv: FacilityEntryNamesDto enforces exactly what the FacilityEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FacilityEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = facilityEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FacilityEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(facilityEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...facilityEntryNamesExample.valid(),
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
