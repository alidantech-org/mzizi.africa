import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorKeyDto } from "#/modules/statistics/schema/dto/indicator-key.dto.ts";
import { indicatorKeyExample } from "@test/modules/statistics/schema/dto/examples/indicator-key.dto.example.ts";

/** Managed by Dryv: IndicatorKeyDto enforces exactly what the IndicatorKey contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorKeyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorKeyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorKeyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorKeyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorKeyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
