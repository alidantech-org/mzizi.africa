import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstrumentCollectionDto } from "#/modules/legal/schema/dto/instrument-collection.dto.ts";
import { instrumentCollectionExample } from "@test/modules/legal/schema/dto/examples/instrument-collection.dto.example.ts";

/** Managed by Dryv: InstrumentCollectionDto enforces exactly what the InstrumentCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstrumentCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = instrumentCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstrumentCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(instrumentCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...instrumentCollectionExample.valid(),
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
