import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationDerivationsListResponseDto } from "#/modules/statistics/dto/observation-derivations-list-response.dto.ts";
import { observationDerivationsListResponseExample } from "#/modules/statistics/dto/observation-derivations-list-response.dto.example.ts";

/** Managed by Dryv: ObservationDerivationsListResponseDto enforces exactly what the ObservationDerivationsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationDerivationsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationDerivationsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationDerivationsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationDerivationsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...observationDerivationsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});