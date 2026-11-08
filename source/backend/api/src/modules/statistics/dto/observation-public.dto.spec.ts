import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationPublicDto } from "#/modules/statistics/dto/observation-public.dto.ts";
import { observationPublicExample } from "#/modules/statistics/dto/observation-public.dto.example.ts";

/** Managed by Dryv: ObservationPublicDto enforces exactly what the ObservationPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...observationPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});