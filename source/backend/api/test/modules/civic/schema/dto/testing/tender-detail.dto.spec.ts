import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TenderDetailDto } from "#/modules/civic/schema/dto/tender-detail.dto.ts";
import { tenderDetailExample } from "@test/modules/civic/schema/dto/examples/tender-detail.dto.example.ts";

/** Managed by Dryv: TenderDetailDto enforces exactly what the TenderDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TenderDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tenderDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TenderDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tenderDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...tenderDetailExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
