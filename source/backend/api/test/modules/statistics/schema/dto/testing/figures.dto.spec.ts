import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FiguresDto } from "#/modules/statistics/schema/dto/figures.dto.ts";
import { figuresExample } from "@test/modules/statistics/schema/dto/examples/figures.dto.example.ts";

/** Managed by Dryv: FiguresDto enforces exactly what the Figures contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FiguresDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = figuresExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FiguresDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(figuresExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...figuresExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
