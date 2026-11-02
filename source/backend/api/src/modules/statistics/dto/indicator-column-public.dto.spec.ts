import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorColumnPublicDto } from "#/modules/statistics/dto/indicator-column-public.dto.ts";
import { indicatorColumnPublicExample } from "#/modules/statistics/dto/indicator-column-public.dto.example.ts";

/** Managed by Dryv: IndicatorColumnPublicDto enforces exactly what the IndicatorColumnPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorColumnPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorColumnPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorColumnPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorColumnPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorColumnPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});