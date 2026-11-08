import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TenderDto } from "#/modules/procurement/dto/tender.dto.ts";
import { tenderExample } from "#/modules/procurement/dto/tender.dto.example.ts";

/** Managed by Dryv: TenderDto enforces exactly what the Tender contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TenderDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tenderExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("TenderDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tenderExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...tenderExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});