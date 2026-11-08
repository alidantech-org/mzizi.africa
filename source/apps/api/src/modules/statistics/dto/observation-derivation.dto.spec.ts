import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationDerivationDto } from "#/modules/statistics/dto/observation-derivation.dto.ts";
import { observationDerivationExample } from "#/modules/statistics/dto/observation-derivation.dto.example.ts";

/** Managed by Dryv: ObservationDerivationDto enforces exactly what the ObservationDerivation contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationDerivationDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationDerivationExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationDerivationDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationDerivationExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...observationDerivationExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});