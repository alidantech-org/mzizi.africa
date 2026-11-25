import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ChildOutlineEntryDto } from "#/modules/geography/schema/dto/child-outline-entry.dto.ts";
import { childOutlineEntryExample } from "@test/modules/geography/schema/dto/examples/child-outline-entry.dto.example.ts";

/** Managed by Dryv: ChildOutlineEntryDto enforces exactly what the ChildOutlineEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ChildOutlineEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = childOutlineEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ChildOutlineEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(childOutlineEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...childOutlineEntryExample.valid(),
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
