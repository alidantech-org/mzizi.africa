import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SourceEntryPublisherNamesDto } from "#/modules/source/schema/dto/source-entry-publisher-names.dto.ts";
import { sourceEntryPublisherNamesExample } from "@test/modules/source/schema/dto/examples/source-entry-publisher-names.dto.example.ts";

/** Managed by Dryv: SourceEntryPublisherNamesDto enforces exactly what the SourceEntryPublisherNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SourceEntryPublisherNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = sourceEntryPublisherNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SourceEntryPublisherNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(sourceEntryPublisherNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...sourceEntryPublisherNamesExample.valid(),
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
