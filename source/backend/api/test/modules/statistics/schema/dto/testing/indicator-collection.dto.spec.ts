import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorCollectionDto } from "#/modules/statistics/schema/dto/indicator-collection.dto.ts";
import { indicatorCollectionExample } from "@test/modules/statistics/schema/dto/examples/indicator-collection.dto.example.ts";

/** Managed by Dryv: IndicatorCollectionDto enforces exactly what the IndicatorCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...indicatorCollectionExample.valid(),
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
