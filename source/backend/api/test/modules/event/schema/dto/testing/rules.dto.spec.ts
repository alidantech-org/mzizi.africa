import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RulesDto } from "#/modules/event/schema/dto/rules.dto.ts";
import { rulesExample } from "@test/modules/event/schema/dto/examples/rules.dto.example.ts";

/** Managed by Dryv: RulesDto enforces exactly what the Rules contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RulesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = rulesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("RulesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(rulesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...rulesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
