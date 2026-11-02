import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationDimensionPublicDto } from "#/modules/statistics/dto/observation-dimension-public.dto.ts";
import { observationDimensionPublicExample } from "#/modules/statistics/dto/observation-dimension-public.dto.example.ts";

/** Managed by Dryv: ObservationDimensionPublicDto enforces exactly what the ObservationDimensionPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationDimensionPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationDimensionPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationDimensionPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationDimensionPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...observationDimensionPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});