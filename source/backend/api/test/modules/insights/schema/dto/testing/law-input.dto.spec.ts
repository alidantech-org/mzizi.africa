import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LawInputDto } from "#/modules/insights/schema/dto/law-input.dto.ts";
import { lawInputExample } from "@test/modules/insights/schema/dto/examples/law-input.dto.example.ts";

/** Managed by Dryv: LawInputDto enforces exactly what the LawInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LawInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = lawInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LawInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(lawInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...lawInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
