import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationDto } from "#/modules/statistics/dto/observation.dto.ts";
import { observationExample } from "#/modules/statistics/dto/observation.dto.example.ts";

/** Managed by Dryv: ObservationDto enforces exactly what the Observation contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...observationExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});