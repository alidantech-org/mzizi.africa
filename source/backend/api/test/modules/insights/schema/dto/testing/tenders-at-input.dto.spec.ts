import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TendersAtInputDto } from "#/modules/insights/schema/dto/tenders-at-input.dto.ts";
import { tendersAtInputExample } from "@test/modules/insights/schema/dto/examples/tenders-at-input.dto.example.ts";

/** Managed by Dryv: TendersAtInputDto enforces exactly what the TendersAtInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TendersAtInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tendersAtInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TendersAtInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tendersAtInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...tendersAtInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
