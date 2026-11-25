import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EraCollectionDto } from "#/modules/history/schema/dto/era-collection.dto.ts";
import { eraCollectionExample } from "@test/modules/history/schema/dto/examples/era-collection.dto.example.ts";

/** Managed by Dryv: EraCollectionDto enforces exactly what the EraCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EraCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = eraCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("EraCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(eraCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...eraCollectionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
