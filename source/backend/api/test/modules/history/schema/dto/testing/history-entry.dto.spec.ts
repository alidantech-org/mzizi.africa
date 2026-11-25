import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { HistoryEntryDto } from "#/modules/history/schema/dto/history-entry.dto.ts";
import { historyEntryExample } from "@test/modules/history/schema/dto/examples/history-entry.dto.example.ts";

/** Managed by Dryv: HistoryEntryDto enforces exactly what the HistoryEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(HistoryEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = historyEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("HistoryEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(historyEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...historyEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
