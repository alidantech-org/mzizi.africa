import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceTalliesDto } from "#/modules/election/schema/dto/place-tallies.dto.ts";
import { placeTalliesExample } from "@test/modules/election/schema/dto/examples/place-tallies.dto.example.ts";

/** Managed by Dryv: PlaceTalliesDto enforces exactly what the PlaceTallies contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceTalliesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeTalliesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceTalliesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeTalliesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeTalliesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
