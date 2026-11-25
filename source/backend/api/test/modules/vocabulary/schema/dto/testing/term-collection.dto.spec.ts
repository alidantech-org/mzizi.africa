import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TermCollectionDto } from "#/modules/vocabulary/schema/dto/term-collection.dto.ts";
import { termCollectionExample } from "@test/modules/vocabulary/schema/dto/examples/term-collection.dto.example.ts";

/** Managed by Dryv: TermCollectionDto enforces exactly what the TermCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TermCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = termCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TermCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(termCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...termCollectionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
