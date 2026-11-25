import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorDetailNamesDto } from "#/modules/statistics/schema/dto/indicator-detail-names.dto.ts";
import { indicatorDetailNamesExample } from "@test/modules/statistics/schema/dto/examples/indicator-detail-names.dto.example.ts";

/** Managed by Dryv: IndicatorDetailNamesDto enforces exactly what the IndicatorDetailNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorDetailNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorDetailNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorDetailNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorDetailNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...indicatorDetailNamesExample.valid(),
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
