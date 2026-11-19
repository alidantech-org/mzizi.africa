import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceCivicYearsDto } from "#/modules/insights/schema/dto/place-civic-years.dto.ts";
import { placeCivicYearsExample } from "@test/modules/insights/schema/dto/examples/place-civic-years.dto.example.ts";

/** Managed by Dryv: PlaceCivicYearsDto enforces exactly what the PlaceCivicYears contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceCivicYearsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeCivicYearsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceCivicYearsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeCivicYearsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeCivicYearsExample.valid(),
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
