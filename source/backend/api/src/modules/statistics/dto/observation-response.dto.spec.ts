import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationResponseDto } from "#/modules/statistics/dto/observation-response.dto.ts";
import { observationResponseExample } from "#/modules/statistics/dto/observation-response.dto.example.ts";

/** Managed by Dryv: ObservationResponseDto enforces exactly what the ObservationResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...observationResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});