import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IdInputDto } from "#/modules/insights/schema/dto/id-input.dto.ts";
import { idInputExample } from "@test/modules/insights/schema/dto/examples/id-input.dto.example.ts";

/** Managed by Dryv: IdInputDto enforces exactly what the IdInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IdInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = idInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IdInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(idInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...idInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
