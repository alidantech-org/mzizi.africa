import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationDerivationPublicDto } from "#/modules/statistics/dto/observation-derivation-public.dto.ts";
import { observationDerivationPublicExample } from "#/modules/statistics/dto/observation-derivation-public.dto.example.ts";

/** Managed by Dryv: ObservationDerivationPublicDto enforces exactly what the ObservationDerivationPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationDerivationPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationDerivationPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationDerivationPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationDerivationPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...observationDerivationPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});