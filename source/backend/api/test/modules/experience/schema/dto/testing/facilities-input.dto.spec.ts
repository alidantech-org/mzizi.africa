import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FacilitiesInputDto } from "#/modules/experience/schema/dto/facilities-input.dto.ts";
import { facilitiesInputExample } from "@test/modules/experience/schema/dto/examples/facilities-input.dto.example.ts";

/** Managed by Dryv: FacilitiesInputDto enforces exactly what the FacilitiesInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FacilitiesInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = facilitiesInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FacilitiesInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(facilitiesInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...facilitiesInputExample.valid(),
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
