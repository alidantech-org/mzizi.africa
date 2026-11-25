import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorDetailDto } from "#/modules/statistics/schema/dto/indicator-detail.dto.ts";
import { indicatorDetailExample } from "@test/modules/statistics/schema/dto/examples/indicator-detail.dto.example.ts";

/** Managed by Dryv: IndicatorDetailDto enforces exactly what the IndicatorDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...indicatorDetailExample.valid(),
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
