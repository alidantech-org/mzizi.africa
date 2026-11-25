import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TenderKeyDto } from "#/modules/civic/schema/dto/tender-key.dto.ts";
import { tenderKeyExample } from "@test/modules/civic/schema/dto/examples/tender-key.dto.example.ts";

/** Managed by Dryv: TenderKeyDto enforces exactly what the TenderKey contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TenderKeyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tenderKeyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TenderKeyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tenderKeyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...tenderKeyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
