import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceCivicClassesDto } from "#/modules/insights/schema/dto/place-civic-classes.dto.ts";
import { placeCivicClassesExample } from "@test/modules/insights/schema/dto/examples/place-civic-classes.dto.example.ts";

/** Managed by Dryv: PlaceCivicClassesDto enforces exactly what the PlaceCivicClasses contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceCivicClassesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeCivicClassesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceCivicClassesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeCivicClassesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeCivicClassesExample.valid(),
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
