import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceCivicYearsClassesDto } from "#/modules/insights/schema/dto/place-civic-years-classes.dto.ts";
import { placeCivicYearsClassesExample } from "@test/modules/insights/schema/dto/examples/place-civic-years-classes.dto.example.ts";

/** Managed by Dryv: PlaceCivicYearsClassesDto enforces exactly what the PlaceCivicYearsClasses contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceCivicYearsClassesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeCivicYearsClassesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceCivicYearsClassesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeCivicYearsClassesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeCivicYearsClassesExample.valid(),
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
