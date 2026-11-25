import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OccurrenceEntryNamesDto } from "#/modules/event/schema/dto/occurrence-entry-names.dto.ts";
import { occurrenceEntryNamesExample } from "@test/modules/event/schema/dto/examples/occurrence-entry-names.dto.example.ts";

/** Managed by Dryv: OccurrenceEntryNamesDto enforces exactly what the OccurrenceEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OccurrenceEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = occurrenceEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OccurrenceEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(occurrenceEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...occurrenceEntryNamesExample.valid(),
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
