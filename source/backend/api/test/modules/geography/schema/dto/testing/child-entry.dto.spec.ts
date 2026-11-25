import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ChildEntryDto } from "#/modules/geography/schema/dto/child-entry.dto.ts";
import { childEntryExample } from "@test/modules/geography/schema/dto/examples/child-entry.dto.example.ts";

/** Managed by Dryv: ChildEntryDto enforces exactly what the ChildEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ChildEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = childEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ChildEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(childEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...childEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
