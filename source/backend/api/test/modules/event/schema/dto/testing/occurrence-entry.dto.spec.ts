import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OccurrenceEntryDto } from "#/modules/event/schema/dto/occurrence-entry.dto.ts";
import { occurrenceEntryExample } from "@test/modules/event/schema/dto/examples/occurrence-entry.dto.example.ts";

/** Managed by Dryv: OccurrenceEntryDto enforces exactly what the OccurrenceEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OccurrenceEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = occurrenceEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OccurrenceEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(occurrenceEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...occurrenceEntryExample.valid(),
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
