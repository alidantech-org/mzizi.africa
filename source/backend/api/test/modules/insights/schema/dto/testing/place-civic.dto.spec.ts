import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceCivicDto } from "#/modules/insights/schema/dto/place-civic.dto.ts";
import { placeCivicExample } from "@test/modules/insights/schema/dto/examples/place-civic.dto.example.ts";

/** Managed by Dryv: PlaceCivicDto enforces exactly what the PlaceCivic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceCivicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeCivicExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceCivicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeCivicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeCivicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
