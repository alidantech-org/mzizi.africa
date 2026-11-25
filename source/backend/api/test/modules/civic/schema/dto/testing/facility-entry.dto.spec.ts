import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FacilityEntryDto } from "#/modules/civic/schema/dto/facility-entry.dto.ts";
import { facilityEntryExample } from "@test/modules/civic/schema/dto/examples/facility-entry.dto.example.ts";

/** Managed by Dryv: FacilityEntryDto enforces exactly what the FacilityEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FacilityEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = facilityEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FacilityEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(facilityEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...facilityEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
