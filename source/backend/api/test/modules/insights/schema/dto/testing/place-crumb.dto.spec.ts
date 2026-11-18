import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceCrumbDto } from "#/modules/insights/schema/dto/place-crumb.dto.ts";
import { placeCrumbExample } from "@test/modules/insights/schema/dto/examples/place-crumb.dto.example.ts";

/** Managed by Dryv: PlaceCrumbDto enforces exactly what the PlaceCrumb contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceCrumbDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeCrumbExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceCrumbDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeCrumbExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeCrumbExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
