import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BidsDto } from "#/modules/civic/schema/dto/bids.dto.ts";
import { bidsExample } from "@test/modules/civic/schema/dto/examples/bids.dto.example.ts";

/** Managed by Dryv: BidsDto enforces exactly what the Bids contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BidsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = bidsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BidsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(bidsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...bidsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
