import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationEntryBreakdownsDto } from "#/modules/statistics/schema/dto/observation-entry-breakdowns.dto.ts";
import { observationEntryBreakdownsExample } from "@test/modules/statistics/schema/dto/examples/observation-entry-breakdowns.dto.example.ts";

/** Managed by Dryv: ObservationEntryBreakdownsDto enforces exactly what the ObservationEntryBreakdowns contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationEntryBreakdownsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationEntryBreakdownsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationEntryBreakdownsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationEntryBreakdownsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...observationEntryBreakdownsExample.valid(),
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
