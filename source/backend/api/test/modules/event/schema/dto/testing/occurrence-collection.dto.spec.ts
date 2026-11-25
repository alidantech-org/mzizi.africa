import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OccurrenceCollectionDto } from "#/modules/event/schema/dto/occurrence-collection.dto.ts";
import { occurrenceCollectionExample } from "@test/modules/event/schema/dto/examples/occurrence-collection.dto.example.ts";

/** Managed by Dryv: OccurrenceCollectionDto enforces exactly what the OccurrenceCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OccurrenceCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = occurrenceCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OccurrenceCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(occurrenceCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...occurrenceCollectionExample.valid(),
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
