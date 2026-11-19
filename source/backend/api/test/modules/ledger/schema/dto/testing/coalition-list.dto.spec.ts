import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CoalitionListDto } from "#/modules/ledger/schema/dto/coalition-list.dto.ts";
import { coalitionListExample } from "@test/modules/ledger/schema/dto/examples/coalition-list.dto.example.ts";

/** Managed by Dryv: CoalitionListDto enforces exactly what the CoalitionList contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CoalitionListDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = coalitionListExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CoalitionListDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(coalitionListExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...coalitionListExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
