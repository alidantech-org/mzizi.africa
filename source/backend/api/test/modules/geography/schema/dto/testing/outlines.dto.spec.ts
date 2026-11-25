import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OutlinesDto } from "#/modules/geography/schema/dto/outlines.dto.ts";
import { outlinesExample } from "@test/modules/geography/schema/dto/examples/outlines.dto.example.ts";

/** Managed by Dryv: OutlinesDto enforces exactly what the Outlines contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OutlinesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = outlinesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OutlinesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(outlinesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...outlinesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
