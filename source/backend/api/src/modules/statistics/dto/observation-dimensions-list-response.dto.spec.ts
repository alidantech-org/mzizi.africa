import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationDimensionsListResponseDto } from "#/modules/statistics/dto/observation-dimensions-list-response.dto.ts";
import { observationDimensionsListResponseExample } from "#/modules/statistics/dto/observation-dimensions-list-response.dto.example.ts";

/** Managed by Dryv: ObservationDimensionsListResponseDto enforces exactly what the ObservationDimensionsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationDimensionsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationDimensionsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationDimensionsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationDimensionsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...observationDimensionsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});