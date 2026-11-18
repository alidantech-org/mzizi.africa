import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorMapDto } from "#/modules/insights/schema/dto/indicator-map.dto.ts";
import { indicatorMapExample } from "@test/modules/insights/schema/dto/examples/indicator-map.dto.example.ts";

/** Managed by Dryv: IndicatorMapDto enforces exactly what the IndicatorMap contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorMapDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorMapExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorMapDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorMapExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorMapExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
