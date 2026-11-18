import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { NearbyInputDto } from "#/modules/insights/schema/dto/nearby-input.dto.ts";
import { nearbyInputExample } from "@test/modules/insights/schema/dto/examples/nearby-input.dto.example.ts";

/** Managed by Dryv: NearbyInputDto enforces exactly what the NearbyInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(NearbyInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = nearbyInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("NearbyInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(nearbyInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...nearbyInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
