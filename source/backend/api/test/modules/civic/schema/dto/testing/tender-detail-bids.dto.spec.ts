import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TenderDetailBidsDto } from "#/modules/civic/schema/dto/tender-detail-bids.dto.ts";
import { tenderDetailBidsExample } from "@test/modules/civic/schema/dto/examples/tender-detail-bids.dto.example.ts";

/** Managed by Dryv: TenderDetailBidsDto enforces exactly what the TenderDetailBids contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TenderDetailBidsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tenderDetailBidsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TenderDetailBidsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tenderDetailBidsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...tenderDetailBidsExample.valid(),
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
