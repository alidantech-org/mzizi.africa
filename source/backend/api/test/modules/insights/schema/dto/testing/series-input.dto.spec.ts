import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SeriesInputDto } from "#/modules/insights/schema/dto/series-input.dto.ts";
import { seriesInputExample } from "@test/modules/insights/schema/dto/examples/series-input.dto.example.ts";

/** Managed by Dryv: SeriesInputDto enforces exactly what the SeriesInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SeriesInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = seriesInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SeriesInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(seriesInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...seriesInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
