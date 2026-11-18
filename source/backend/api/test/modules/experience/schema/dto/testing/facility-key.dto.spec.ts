import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FacilityKeyDto } from "#/modules/experience/schema/dto/facility-key.dto.ts";
import { facilityKeyExample } from "@test/modules/experience/schema/dto/examples/facility-key.dto.example.ts";

/** Managed by Dryv: FacilityKeyDto enforces exactly what the FacilityKey contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FacilityKeyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = facilityKeyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FacilityKeyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(facilityKeyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...facilityKeyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
