import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorMapIndicatorDto } from "#/modules/insights/schema/dto/indicator-map-indicator.dto.ts";
import { indicatorMapIndicatorExample } from "@test/modules/insights/schema/dto/examples/indicator-map-indicator.dto.example.ts";

/** Managed by Dryv: IndicatorMapIndicatorDto enforces exactly what the IndicatorMapIndicator contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorMapIndicatorDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorMapIndicatorExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorMapIndicatorDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorMapIndicatorExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...indicatorMapIndicatorExample.valid(),
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
