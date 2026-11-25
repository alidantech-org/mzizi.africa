import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceLinkDto } from "#/modules/frontend/schema/dto/place-link.dto.ts";
import { placeLinkExample } from "@test/modules/frontend/schema/dto/examples/place-link.dto.example.ts";

/** Managed by Dryv: PlaceLinkDto enforces exactly what the PlaceLink contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceLinkDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeLinkExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceLinkDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeLinkExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeLinkExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
