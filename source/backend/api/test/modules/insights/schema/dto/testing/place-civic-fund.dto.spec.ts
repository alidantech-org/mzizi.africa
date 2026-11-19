import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceCivicFundDto } from "#/modules/insights/schema/dto/place-civic-fund.dto.ts";
import { placeCivicFundExample } from "@test/modules/insights/schema/dto/examples/place-civic-fund.dto.example.ts";

/** Managed by Dryv: PlaceCivicFundDto enforces exactly what the PlaceCivicFund contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceCivicFundDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeCivicFundExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceCivicFundDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeCivicFundExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeCivicFundExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
