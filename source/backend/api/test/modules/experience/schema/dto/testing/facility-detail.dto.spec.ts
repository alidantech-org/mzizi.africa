import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FacilityDetailDto } from "#/modules/experience/schema/dto/facility-detail.dto.ts";
import { facilityDetailExample } from "@test/modules/experience/schema/dto/examples/facility-detail.dto.example.ts";

/** Managed by Dryv: FacilityDetailDto enforces exactly what the FacilityDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FacilityDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = facilityDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FacilityDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(facilityDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...facilityDetailExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
