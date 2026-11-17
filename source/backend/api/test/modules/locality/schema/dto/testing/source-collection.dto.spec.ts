import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SourceCollectionDto } from "#/modules/locality/schema/dto/source-collection.dto.ts";
import { sourceCollectionExample } from "@test/modules/locality/schema/dto/examples/source-collection.dto.example.ts";

/** Managed by Dryv: SourceCollectionDto enforces exactly what the SourceCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SourceCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = sourceCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SourceCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(sourceCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...sourceCollectionExample.valid(),
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
