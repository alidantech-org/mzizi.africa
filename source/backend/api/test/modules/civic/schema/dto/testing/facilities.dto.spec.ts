import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FacilitiesDto } from "#/modules/civic/schema/dto/facilities.dto.ts";
import { facilitiesExample } from "@test/modules/civic/schema/dto/examples/facilities.dto.example.ts";

/** Managed by Dryv: FacilitiesDto enforces exactly what the Facilities contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FacilitiesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = facilitiesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FacilitiesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(facilitiesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...facilitiesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
