import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorWindowDto } from "#/modules/statistics/schema/dto/indicator-window.dto.ts";
import { indicatorWindowExample } from "@test/modules/statistics/schema/dto/examples/indicator-window.dto.example.ts";

/** Managed by Dryv: IndicatorWindowDto enforces exactly what the IndicatorWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorWindowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...indicatorWindowExample.valid(),
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
