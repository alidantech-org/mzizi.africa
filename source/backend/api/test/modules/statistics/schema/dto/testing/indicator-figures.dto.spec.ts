import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorFiguresDto } from "#/modules/statistics/schema/dto/indicator-figures.dto.ts";
import { indicatorFiguresExample } from "@test/modules/statistics/schema/dto/examples/indicator-figures.dto.example.ts";

/** Managed by Dryv: IndicatorFiguresDto enforces exactly what the IndicatorFigures contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorFiguresDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorFiguresExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorFiguresDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorFiguresExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...indicatorFiguresExample.valid(),
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
