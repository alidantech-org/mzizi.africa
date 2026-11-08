import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BidPublicDto } from "#/modules/procurement/dto/bid-public.dto.ts";
import { bidPublicExample } from "#/modules/procurement/dto/bid-public.dto.example.ts";

/** Managed by Dryv: BidPublicDto enforces exactly what the BidPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BidPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = bidPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("BidPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(bidPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...bidPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});