import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorEntryDto } from "#/modules/statistics/schema/dto/indicator-entry.dto.ts";
import { indicatorEntryExample } from "@test/modules/statistics/schema/dto/examples/indicator-entry.dto.example.ts";

/** Managed by Dryv: IndicatorEntryDto enforces exactly what the IndicatorEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
