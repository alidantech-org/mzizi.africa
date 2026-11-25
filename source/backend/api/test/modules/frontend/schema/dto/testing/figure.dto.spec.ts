import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FigureDto } from "#/modules/frontend/schema/dto/figure.dto.ts";
import { figureExample } from "@test/modules/frontend/schema/dto/examples/figure.dto.example.ts";

/** Managed by Dryv: FigureDto enforces exactly what the Figure contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FigureDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = figureExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FigureDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(figureExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...figureExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
