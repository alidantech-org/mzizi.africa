import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FigureEntryDto } from "#/modules/statistics/schema/dto/figure-entry.dto.ts";
import { figureEntryExample } from "@test/modules/statistics/schema/dto/examples/figure-entry.dto.example.ts";

/** Managed by Dryv: FigureEntryDto enforces exactly what the FigureEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FigureEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = figureEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FigureEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(figureEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...figureEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
