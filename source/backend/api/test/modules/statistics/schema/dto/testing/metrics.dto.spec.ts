import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MetricsDto } from "#/modules/statistics/schema/dto/metrics.dto.ts";
import { metricsExample } from "@test/modules/statistics/schema/dto/examples/metrics.dto.example.ts";

/** Managed by Dryv: MetricsDto enforces exactly what the Metrics contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MetricsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = metricsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MetricsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(metricsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...metricsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
