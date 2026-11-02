import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationDerivationResponseDto } from "#/modules/statistics/dto/observation-derivation-response.dto.ts";
import { observationDerivationResponseExample } from "#/modules/statistics/dto/observation-derivation-response.dto.example.ts";

/** Managed by Dryv: ObservationDerivationResponseDto enforces exactly what the ObservationDerivationResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationDerivationResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationDerivationResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationDerivationResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationDerivationResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...observationDerivationResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});