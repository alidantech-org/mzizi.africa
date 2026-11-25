import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationCollectionDto } from "#/modules/statistics/schema/dto/observation-collection.dto.ts";
import { observationCollectionExample } from "@test/modules/statistics/schema/dto/examples/observation-collection.dto.example.ts";

/** Managed by Dryv: ObservationCollectionDto enforces exactly what the ObservationCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...observationCollectionExample.valid(),
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
