import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { VenuesDto } from "#/modules/event/schema/dto/venues.dto.ts";
import { venuesExample } from "@test/modules/event/schema/dto/examples/venues.dto.example.ts";

/** Managed by Dryv: VenuesDto enforces exactly what the Venues contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(VenuesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = venuesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("VenuesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(venuesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...venuesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
