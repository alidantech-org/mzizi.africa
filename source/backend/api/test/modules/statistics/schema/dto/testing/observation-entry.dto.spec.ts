import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationEntryDto } from "#/modules/statistics/schema/dto/observation-entry.dto.ts";
import { observationEntryExample } from "@test/modules/statistics/schema/dto/examples/observation-entry.dto.example.ts";

/** Managed by Dryv: ObservationEntryDto enforces exactly what the ObservationEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...observationEntryExample.valid(),
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
