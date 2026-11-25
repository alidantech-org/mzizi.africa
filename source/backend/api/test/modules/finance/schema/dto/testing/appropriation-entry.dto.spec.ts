import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AppropriationEntryDto } from "#/modules/finance/schema/dto/appropriation-entry.dto.ts";
import { appropriationEntryExample } from "@test/modules/finance/schema/dto/examples/appropriation-entry.dto.example.ts";

/** Managed by Dryv: AppropriationEntryDto enforces exactly what the AppropriationEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AppropriationEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = appropriationEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("AppropriationEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(appropriationEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...appropriationEntryExample.valid(),
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
