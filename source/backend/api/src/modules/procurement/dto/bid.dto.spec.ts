import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BidDto } from "#/modules/procurement/dto/bid.dto.ts";
import { bidExample } from "#/modules/procurement/dto/bid.dto.example.ts";

/** Managed by Dryv: BidDto enforces exactly what the Bid contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BidDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = bidExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("BidDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(bidExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...bidExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});