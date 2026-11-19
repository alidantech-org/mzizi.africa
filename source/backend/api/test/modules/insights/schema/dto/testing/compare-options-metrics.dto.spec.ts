import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CompareOptionsMetricsDto } from "#/modules/insights/schema/dto/compare-options-metrics.dto.ts";
import { compareOptionsMetricsExample } from "@test/modules/insights/schema/dto/examples/compare-options-metrics.dto.example.ts";

/** Managed by Dryv: CompareOptionsMetricsDto enforces exactly what the CompareOptionsMetrics contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CompareOptionsMetricsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = compareOptionsMetricsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CompareOptionsMetricsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(compareOptionsMetricsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...compareOptionsMetricsExample.valid(),
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
