import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FacilityRowDto } from "#/modules/experience/schema/dto/facility-row.dto.ts";
import { facilityRowExample } from "@test/modules/experience/schema/dto/examples/facility-row.dto.example.ts";

/** Managed by Dryv: FacilityRowDto enforces exactly what the FacilityRow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FacilityRowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = facilityRowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FacilityRowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(facilityRowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...facilityRowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
