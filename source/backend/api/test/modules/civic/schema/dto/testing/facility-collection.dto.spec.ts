import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FacilityCollectionDto } from "#/modules/civic/schema/dto/facility-collection.dto.ts";
import { facilityCollectionExample } from "@test/modules/civic/schema/dto/examples/facility-collection.dto.example.ts";

/** Managed by Dryv: FacilityCollectionDto enforces exactly what the FacilityCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FacilityCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = facilityCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FacilityCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(facilityCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...facilityCollectionExample.valid(),
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
