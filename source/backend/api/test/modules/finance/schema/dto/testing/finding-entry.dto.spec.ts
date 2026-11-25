import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FindingEntryDto } from "#/modules/finance/schema/dto/finding-entry.dto.ts";
import { findingEntryExample } from "@test/modules/finance/schema/dto/examples/finding-entry.dto.example.ts";

/** Managed by Dryv: FindingEntryDto enforces exactly what the FindingEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FindingEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = findingEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FindingEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(findingEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...findingEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
