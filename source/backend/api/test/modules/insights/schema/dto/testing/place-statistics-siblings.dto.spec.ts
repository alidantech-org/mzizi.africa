import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceStatisticsSiblingsDto } from "#/modules/insights/schema/dto/place-statistics-siblings.dto.ts";
import { placeStatisticsSiblingsExample } from "@test/modules/insights/schema/dto/examples/place-statistics-siblings.dto.example.ts";

/** Managed by Dryv: PlaceStatisticsSiblingsDto enforces exactly what the PlaceStatisticsSiblings contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceStatisticsSiblingsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeStatisticsSiblingsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceStatisticsSiblingsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeStatisticsSiblingsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeStatisticsSiblingsExample.valid(),
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
