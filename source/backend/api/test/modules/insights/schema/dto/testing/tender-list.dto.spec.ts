import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TenderListDto } from "#/modules/insights/schema/dto/tender-list.dto.ts";
import { tenderListExample } from "@test/modules/insights/schema/dto/examples/tender-list.dto.example.ts";

/** Managed by Dryv: TenderListDto enforces exactly what the TenderList contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TenderListDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tenderListExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TenderListDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tenderListExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...tenderListExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
