import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TokensDto } from "#/modules/community/schema/dto/tokens.dto.ts";
import { tokensExample } from "@test/modules/community/schema/dto/examples/tokens.dto.example.ts";

/** Managed by Dryv: TokensDto enforces exactly what the Tokens contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TokensDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tokensExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TokensDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tokensExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...tokensExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
