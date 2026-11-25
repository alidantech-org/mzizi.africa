import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationScopeDto } from "#/modules/statistics/schema/dto/observation-scope.dto.ts";
import { observationScopeExample } from "@test/modules/statistics/schema/dto/examples/observation-scope.dto.example.ts";

/** Managed by Dryv: ObservationScopeDto enforces exactly what the ObservationScope contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationScopeDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationScopeExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationScopeDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationScopeExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...observationScopeExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
