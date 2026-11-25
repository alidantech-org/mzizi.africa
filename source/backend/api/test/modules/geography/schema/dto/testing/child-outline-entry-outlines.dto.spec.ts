import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ChildOutlineEntryOutlinesDto } from "#/modules/geography/schema/dto/child-outline-entry-outlines.dto.ts";
import { childOutlineEntryOutlinesExample } from "@test/modules/geography/schema/dto/examples/child-outline-entry-outlines.dto.example.ts";

/** Managed by Dryv: ChildOutlineEntryOutlinesDto enforces exactly what the ChildOutlineEntryOutlines contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ChildOutlineEntryOutlinesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = childOutlineEntryOutlinesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ChildOutlineEntryOutlinesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(childOutlineEntryOutlinesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...childOutlineEntryOutlinesExample.valid(),
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
