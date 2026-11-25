import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CodesDto } from "#/modules/economy/schema/dto/codes.dto.ts";
import { codesExample } from "@test/modules/economy/schema/dto/examples/codes.dto.example.ts";

/** Managed by Dryv: CodesDto enforces exactly what the Codes contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CodesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = codesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CodesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(codesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...codesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
