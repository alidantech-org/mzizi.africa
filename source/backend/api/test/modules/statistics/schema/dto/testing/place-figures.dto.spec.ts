import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceFiguresDto } from "#/modules/statistics/schema/dto/place-figures.dto.ts";
import { placeFiguresExample } from "@test/modules/statistics/schema/dto/examples/place-figures.dto.example.ts";

/** Managed by Dryv: PlaceFiguresDto enforces exactly what the PlaceFigures contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceFiguresDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeFiguresExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceFiguresDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeFiguresExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeFiguresExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
