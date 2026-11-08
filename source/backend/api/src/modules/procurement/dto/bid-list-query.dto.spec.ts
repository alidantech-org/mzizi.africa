import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BidListQueryDto } from "#/modules/procurement/dto/bid-list-query.dto.ts";
import { bidListQueryExample } from "#/modules/procurement/dto/bid-list-query.dto.example.ts";

/** Managed by Dryv: BidListQueryDto enforces exactly what the BidListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BidListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = bidListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("BidListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(bidListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...bidListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});