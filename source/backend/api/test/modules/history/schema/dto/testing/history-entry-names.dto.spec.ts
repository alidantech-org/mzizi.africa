import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { HistoryEntryNamesDto } from "#/modules/history/schema/dto/history-entry-names.dto.ts";
import { historyEntryNamesExample } from "@test/modules/history/schema/dto/examples/history-entry-names.dto.example.ts";

/** Managed by Dryv: HistoryEntryNamesDto enforces exactly what the HistoryEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(HistoryEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = historyEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("HistoryEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(historyEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...historyEntryNamesExample.valid(),
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
