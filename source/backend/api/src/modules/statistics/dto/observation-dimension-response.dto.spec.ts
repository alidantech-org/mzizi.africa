import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationDimensionResponseDto } from "#/modules/statistics/dto/observation-dimension-response.dto.ts";
import { observationDimensionResponseExample } from "#/modules/statistics/dto/observation-dimension-response.dto.example.ts";

/** Managed by Dryv: ObservationDimensionResponseDto enforces exactly what the ObservationDimensionResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationDimensionResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationDimensionResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationDimensionResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationDimensionResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...observationDimensionResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});