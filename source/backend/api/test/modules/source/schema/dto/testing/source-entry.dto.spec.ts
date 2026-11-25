import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SourceEntryDto } from "#/modules/source/schema/dto/source-entry.dto.ts";
import { sourceEntryExample } from "@test/modules/source/schema/dto/examples/source-entry.dto.example.ts";

/** Managed by Dryv: SourceEntryDto enforces exactly what the SourceEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SourceEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = sourceEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SourceEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(sourceEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...sourceEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
