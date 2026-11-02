import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationDimensionDto } from "#/modules/statistics/dto/observation-dimension.dto.ts";
import { observationDimensionExample } from "#/modules/statistics/dto/observation-dimension.dto.example.ts";

/** Managed by Dryv: ObservationDimensionDto enforces exactly what the ObservationDimension contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationDimensionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationDimensionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationDimensionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationDimensionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...observationDimensionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});