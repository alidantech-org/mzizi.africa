import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { HistoryCollectionDto } from "#/modules/history/schema/dto/history-collection.dto.ts";
import { historyCollectionExample } from "@test/modules/history/schema/dto/examples/history-collection.dto.example.ts";

/** Managed by Dryv: HistoryCollectionDto enforces exactly what the HistoryCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(HistoryCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = historyCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("HistoryCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(historyCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...historyCollectionExample.valid(),
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
