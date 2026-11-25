import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TenderDetailNamesDto } from "#/modules/civic/schema/dto/tender-detail-names.dto.ts";
import { tenderDetailNamesExample } from "@test/modules/civic/schema/dto/examples/tender-detail-names.dto.example.ts";

/** Managed by Dryv: TenderDetailNamesDto enforces exactly what the TenderDetailNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TenderDetailNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tenderDetailNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TenderDetailNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tenderDetailNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...tenderDetailNamesExample.valid(),
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
