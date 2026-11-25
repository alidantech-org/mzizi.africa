import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FigureCollectionDto } from "#/modules/statistics/schema/dto/figure-collection.dto.ts";
import { figureCollectionExample } from "@test/modules/statistics/schema/dto/examples/figure-collection.dto.example.ts";

/** Managed by Dryv: FigureCollectionDto enforces exactly what the FigureCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FigureCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = figureCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FigureCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(figureCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...figureCollectionExample.valid(),
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
